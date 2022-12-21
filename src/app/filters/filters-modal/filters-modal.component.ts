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

export class UsageMap extends Map<string, UsageState> {}

type UsageState = {
  name: string;
  checked: boolean;
};

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
  tmpStates: {
    [index: string]: any;
    users: PickerState | null;
    species: PickerState | null;
    usages: UsageMap | null;
    radius: number;
    start: string;
    end: string;
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
    this.currentDate = new Date().toISOString();
    this.getUsers = getUsers(this.api);
    this.getSpecies = getSpecies(this.api);
    this.tmpStates = {
      users: null,
      species: null,
      usages: null,
      radius: 1,
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    };
    this.states = new State(this.storage, 'filters-modal');

    const iterable = this.states.getKeys();
    for (const value of iterable) {
      let keys = value.split('-');
      const key = keys[keys.length - 1];
      this.storage.get(value).then((res) => (this.tmpStates[key] = res));
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
      await this.storage.set(value, this.tmpStates[key]);
    }
    console.log({ states: this.tmpStates });
    return this.modalCtrl.dismiss(this.tmpStates, 'confirm');
  }

  onChoosenUser(state: PickerState) {
    this.tmpStates.users = state;
  }

  onChoosenSpecies(state: PickerState) {
    this.tmpStates.species = state;
  }

  onStartChange(e: Event) {
    const event = e as CustomEvent;
    this.tmpStates.start = event.detail.value;
  }

  onEndChange(e: Event) {
    const event = e as CustomEvent;
    this.tmpStates.end = event.detail.value;
  }

  onRadiusChange(e: Event) {
    const event = e as CustomEvent;
    this.tmpStates.radius = event.detail.value;
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const usage = event.detail.value;
    const isChecked = event.detail.checked;
    if (isChecked) this.usage.set(usage, { name: usage, checked: isChecked });
    if (!isChecked) this.usage.delete(usage);
    this.tmpStates.usages = this.usage;
  }
}
