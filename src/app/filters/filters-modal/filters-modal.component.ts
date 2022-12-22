import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usage } from 'src/app/models/usages';
import { FilterForm, ChoosenItem, CustomMap } from '../../models/standard';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { Observable } from 'rxjs';
import { User, UserFilter } from '../../models/users';
import { PaginatedResponse } from '../../models/response';
import { Specy, SpeciesFilter } from '../../models/species';
import { PickerState } from '../../models/picker';
import { Storage } from '@ionic/storage';
import { FiltersModalState } from './Filters-modal-state';
import { UsageState, UsageMap, TmpState } from '../../models/filters';

function getDefaultState(): PickerState {
  return {
    items: [],
    search: '',
    chips: new CustomMap(),
    favorites: [],
    currentPage: 1,
    lastPage: 1,
  };
}

function getDefaultUsageState(): UsageMap {
  const map = new Map();
  Object.keys(Usage).forEach((value) => {
    map.set(value, { name: value, checked: false });
  });
  return map;
}

const currentDateIso = new Date().toISOString();
const currentDate = new Date();
const previousYearDate = new Date();
previousYearDate.setFullYear(currentDate.getFullYear() - 1);
const previousYearDateIso = previousYearDate.toISOString();

class State extends FiltersModalState {
  users: Observable<PickerState>;
  species: Observable<PickerState>;
  usages: Observable<UsageMap>;
  radius: Observable<number>;
  start: Observable<string>;
  end: Observable<string>;
  constructor(storage: Storage, stateKey: string) {
    super(storage, stateKey);
    this.users = this.setProperty('users', getDefaultState);
    this.species = this.setProperty('species', getDefaultState);
    this.usages = this.setProperty('usages', getDefaultUsageState);
    this.radius = this.setProperty('radius', () => 1);
    this.start = this.setProperty('start', () => currentDateIso);
    this.end = this.setProperty('end', () => previousYearDateIso);
  }
}

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss'],
}) // eslint-disable-line
export class FiltersModalComponent implements OnInit {
  // @Input() filterStorageKey: string = 'filters-modal';
  @Output() filter = new EventEmitter<FilterForm>();

  currentDate: string;
  usage: UsageMap = new UsageMap();
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
  states: State;
  tmpState: TmpState;

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
    this.currentDate = new Date().toISOString();
    this.getUsers = this.getUsersFunc(this.api);
    this.getSpecies = this.getSpeciesFunc(this.api);
    this.states = new State(this.storage, 'filters-modal');
    this.tmpState = {
      users: null,
      species: null,
      usages: null,
      radius: 1,
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    };

    const iterable = this.states.getKeys();
    for (const value of iterable) {
      let keys = value.split('-');
      const key = keys[keys.length - 1];
      this.storage.get(value).then((res) => (this.tmpState[key] = res));
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    const iterable = this.states.getKeys();
    for (const value of iterable) {
      let keys = value.split('-');
      const key = keys[keys.length - 1];
      await this.storage.set(value, this.tmpState[key]);
    }
    return this.modalCtrl.dismiss(this.tmpState, 'confirm');
  }

  onChoosenUser(state: PickerState) {
    this.tmpState.users = state;
  }

  onChoosenSpecies(state: PickerState) {
    this.tmpState.species = state;
  }

  onStartChange(e: Event) {
    const event = e as CustomEvent;
    this.tmpState.start = event.detail.value;
  }

  onEndChange(e: Event) {
    const event = e as CustomEvent;
    this.tmpState.end = event.detail.value;
  }

  onRadiusChange(e: Event) {
    const event = e as CustomEvent;
    this.tmpState.radius = event.detail.value;
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const usage = event.detail.value;
    const isChecked = event.detail.checked;
    if (isChecked) this.usage.set(usage, { name: usage, checked: isChecked });
    if (!isChecked) this.usage.delete(usage);
    this.tmpState.usages = this.usage;
  }

  private getUsersFunc(
    api: ShroomShareApiService
  ): (option: UserFilter) => Observable<PaginatedResponse<User>> {
    return (option: UserFilter): Observable<PaginatedResponse<User>> => {
      return api.getUsers$(option);
    };
  }

  private getSpeciesFunc(
    api: ShroomShareApiService
  ): (option: SpeciesFilter) => Observable<PaginatedResponse<Specy>> {
    return (option: SpeciesFilter): Observable<PaginatedResponse<Specy>> => {
      return api.getSpecies$(option);
    };
  }
}
