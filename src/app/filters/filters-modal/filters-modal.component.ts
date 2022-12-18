import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usage } from 'src/app/models/usages';
import { FilterForm, ChoosenItem } from '../../models/standard';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { Observable } from 'rxjs';
import { User, UserFilter } from '../../models/users';
import { PaginatedResponse } from '../../models/response';
import { Specy, SpeciesFilter } from '../../models/species';
import { PickerState } from '../../models/picker';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';

export class UsageMap extends Map<string, Usage> {}

function getUsers(api: ShroomShareApiService) {
  return (option: UserFilter): Observable<PaginatedResponse<User>> => {
    return api.getUsers$(option);
  };
}

function getSpecies(api: ShroomShareApiService) {
  return (option: SpeciesFilter): Observable<PaginatedResponse<Specy>> => {
    return api.getSpecies$(option);
  };
}

const filtersStorageKeys = {
  users: 'filters-modal-users',
  species: 'filters-modal-species',
};

type ModalState = {
  users?: PickerState;
  species?: PickerState;
};

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss'],
}) // eslint-disable-line
export class FiltersModalComponent implements OnInit {
  // @Input() filterStorageKey: string = 'filters-modal';
  @Output() filter = new EventEmitter<FilterForm>();

  usage: UsageMap = new UsageMap();
  radius: number = 0;
  users: ChoosenItem[] = [];
  species: ChoosenItem[] = [];
  allUsages: Usage[] = [Usage.edible, Usage.inedible];
  getUsers: (option: UserFilter) => Observable<PaginatedResponse<User>>;
  getSpecies: (option: SpeciesFilter) => Observable<PaginatedResponse<Specy>>;
  userKeys = { id: 'id', searchable: 'username' };
  specyKeys = { id: 'id', searchable: 'name' };
  allFavorites = [
    { username: 'John', id: '...', admin: false },
    { username: 'Johnny', id: '...', admin: false },
    { username: 'Eloise', id: '...', admin: false },
  ];
  states: {
    [index: string]: any;
    users: Observable<PickerState> | null;
    species: Observable<PickerState> | null;
  };
  tmpStates: {
    [index: string]: any;
    users: PickerState | null;
    species: PickerState | null;
  };

  async ngOnInit() {
    // if (this.filterStorageKey === '') {
    //   throw new Error(`property 'filtersStorageKey' should be defined.`);
    // }
  }

  constructor(
    private modalCtrl: ModalController,
    private api: ShroomShareApiService,
    private storage: Storage
  ) {
    this.getUsers = getUsers(this.api);
    this.getSpecies = getSpecies(this.api);
    this.states = {
      users: from(this.storage.get(filtersStorageKeys.users)),
      species: from(this.storage.get(filtersStorageKeys.species)),
    };
    this.tmpStates = {
      users: null,
      species: null,
    };
    const iterable = Object.entries(filtersStorageKeys);
    for (const entries of iterable) {
      const [key, value] = [entries[0], entries[1]];
      this.storage.get(value).then((res) => {
        this.tmpStates[key] = res;
      });
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    const form = {
      users: this.users,
      species: this.species,
      usage: Array.from(this.usage.values()),
      radius: this.radius,
    };
    const iterable = Object.entries(filtersStorageKeys);
    for (const entries of iterable) {
      const [key, value] = [entries[0], entries[1]];
      await this.storage.set(value, this.tmpStates[key]);
    }
    return this.modalCtrl.dismiss(form, 'confirm');
  }

  onChoosenUser(state: PickerState) {
    this.tmpStates.users = state;
  }

  onChoosenSpecies(state: PickerState) {
    this.tmpStates.species = state;
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const usage = event.detail.value;
    const isChecked = event.detail.checked;
    if (isChecked) this.usage.set(usage, usage);
    if (!isChecked) this.usage.delete(usage);
  }
}
