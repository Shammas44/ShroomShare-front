import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Usage } from 'src/app/models/usages';
import { CustomMap, FilterForm, storageKeys } from '../../models/standard';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { Observable } from 'rxjs';
import { User, UserFilter } from '../../models/users';
import { PaginatedResponse } from '../../models/response';
import { Specy, SpeciesFilter } from '../../models/species';
import { PickerState } from '../../models/picker';
import { Storage } from '@ionic/storage';
import { StateParams } from '../Filters-modal-state';
import { UsageMap, TmpState } from '../../models/filters';
import { modalRole } from '../../models/modal';
import { Modal } from '../modal';

function getDefaultState(): PickerState {
  return {
    items: [],
    search: '',
    chips: new CustomMap(),
    favorites: [],
    currentPage: 1,
    lastPage: 2,
  };
}

function getDefaultUsageState(): UsageMap {
  const map = new Map();
  Object.entries(Usage).forEach((values) => {
    const [key, value] = [values[0], values[1]];
    map.set(value, { name: value, checked: false, value: key });
  });
  return map;
}

const currentDateIso = new Date().toISOString();
const currentDate = new Date();
const prevYearDate = new Date();
prevYearDate.setFullYear(currentDate.getFullYear() - 1);
const prevYearDateIso = prevYearDate.toISOString();

const params: StateParams[] = [
  { key: 'species', storageKey: storageKeys.filterModalMySpecies, defaultValue: getDefaultState },
  {
    key: 'usages',
    storageKey: storageKeys.filterModalMyUsages,
    defaultValue: getDefaultUsageState,
  },
  { key: 'start', storageKey: storageKeys.filterModalMyStart, defaultValue: () => prevYearDateIso },
  { key: 'end', storageKey: storageKeys.filterModalMyEnd, defaultValue: () => currentDateIso },
];

const tmpState: TmpState = {
  species: null,
  usages: getDefaultUsageState(),
  start: prevYearDateIso,
  end: currentDateIso,
};

@Component({
  selector: 'app-filters-modal-my-mushroom',
  templateUrl: '../filters-modal.component.html',
  styleUrls: ['../filters-modal.component.scss'],
})
export class FiltersModalMyMushroomComponent extends Modal implements OnInit {
  getUsers: (option: UserFilter) => Observable<PaginatedResponse<User>>;
  getSpecies: (option: SpeciesFilter) => Observable<PaginatedResponse<Specy>>;
  allFavorites = [];
  @Output() filter = new EventEmitter<FilterForm>();

  constructor(
    private modalCtrl: ModalController,
    private api: ShroomShareApiService,
    storage: Storage
  ) {
    super(storage, params, tmpState);
    this.getUsers = this.getUsersFunc(this.api);
    this.getSpecies = this.getSpeciesFunc(this.api);
  }

  async ngOnInit() {
    // if (this.filterStorageKey === '') {
    //   throw new Error(`property 'filtersStorageKey' should be defined.`);
    // }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, modalRole.cancel);
  }

  async confirm() {
    const iterable = this.states.getKeys();
    for (const value of iterable) {
      let keys = value.split('-');
      const key = keys[keys.length - 1] as keyof TmpState;
      await this.storage.set(value, this.tmpState[key]);
    }
    return this.modalCtrl.dismiss(this.tmpState, modalRole.confirm);
  }
}
