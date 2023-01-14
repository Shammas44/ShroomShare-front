import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FilterForm, storageKeys } from '../../models/standard';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { Observable } from 'rxjs';
import { User, UserFilter } from '../../models/users';
import { PaginatedResponse } from '../../models/response';
import { Specy, SpeciesFilter } from '../../models/species';
import { Storage } from '@ionic/storage';
import { StateParams } from '../Filters-modal-state';
import { TmpState } from '../../models/filters';
import { modalRole } from '../../models/modal';
import { Modal } from '../modal';
import {
  getDefaultState,
  getDefaultUsageState,
  getDate,
} from '../../utils/modal-utility-functions';
import { PickerCityState } from 'src/app/models/picker';

const allFavorites = [
  { username: 'John', id: '...', admin: false },
  { username: 'Johnny', id: '...', admin: false },
  { username: 'Eloise', id: '...', admin: false },
] as User[];

const defaultRadius = 1000;
const defaultState = () => getDefaultState(allFavorites);
const defaultCity = (): PickerCityState => {
  return { search: '', items: [] };
};
const d = getDate();

const params: StateParams[] = [
  { key: 'users', storageKey: storageKeys.filterModalUsers, defaultValue: defaultState },
  { key: 'species', storageKey: storageKeys.filterModalSpecies, defaultValue: defaultState },
  { key: 'usages', storageKey: storageKeys.filterModalUsages, defaultValue: getDefaultUsageState },
  { key: 'start', storageKey: storageKeys.filterModalStart, defaultValue: () => d.prevYearDateIso },
  { key: 'end', storageKey: storageKeys.filterModalEnd, defaultValue: () => d.currentDateIso },
  { key: 'radius', storageKey: storageKeys.filterModalRadius, defaultValue: () => defaultRadius },
  { key: 'city', storageKey: storageKeys.filterModalCity, defaultValue: defaultCity },
];

const tmpState: TmpState = {
  users: null,
  species: null,
  usages: getDefaultUsageState(),
  radius: defaultRadius,
  start: d.prevYearDateIso,
  end: d.currentDateIso,
  city: defaultCity(),
};

@Component({
  selector: 'app-filters-modal-map',
  templateUrl: '../filters-modal.component.html',
  styleUrls: ['../filters-modal.component.scss'],
})
export class FiltersModalMapComponent extends Modal implements OnInit {
  getUsers: (option: UserFilter) => Observable<PaginatedResponse<User>>;
  getSpecies: (option: SpeciesFilter) => Observable<PaginatedResponse<Specy>>;
  allFavorites = allFavorites;

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
