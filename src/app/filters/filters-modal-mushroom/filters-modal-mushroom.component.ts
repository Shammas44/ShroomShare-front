import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { storageKeys } from '../../models/standard';
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
import { StorageService } from 'src/app/localStorage/local-storage.service';
import { PickerState } from 'src/app/models/picker';

const allFavorites = [
  { username: 'John', id: '...', admin: false },
  { username: 'Johnny', id: '...', admin: false },
  { username: 'Eloise', id: '...', admin: false },
] as User[];

const defaultState = (favorite = allFavorites) => getDefaultState(favorite);

const defaultRadius = 1000;
const d = getDate();

const params = (defaultState: () => PickerState): StateParams[] => {
  return [
    { key: 'users', storageKey: storageKeys.filterModalUsers, defaultValue: defaultState },
    {
      key: 'species',
      storageKey: storageKeys.filterModalSpecies,
      defaultValue: defaultState,
    },
    {
      key: 'usages',
      storageKey: storageKeys.filterModalUsages,
      defaultValue: getDefaultUsageState,
    },
    {
      key: 'start',
      storageKey: storageKeys.filterModalStart,
      defaultValue: () => d.prevYearDateIso,
    },
    {
      key: 'end',
      storageKey: storageKeys.filterModalEnd,
      defaultValue: () => d.currentDateIso,
    },
  ];
};
const tmpState: TmpState = {
  users: null,
  species: null,
  usages: getDefaultUsageState(),
  radius: defaultRadius,
  start: d.prevYearDateIso,
  end: d.currentDateIso,
};

@Component({
  selector: 'app-filters-modal-mushroom',
  templateUrl: '../filters-modal.component.html',
  styleUrls: ['../filters-modal.component.scss'],
})
export class FiltersModalMushroomComponent extends Modal implements OnInit {
  getUsers: (option: UserFilter) => Observable<PaginatedResponse<User>>;
  getSpecies: (option: SpeciesFilter) => Observable<PaginatedResponse<Specy>>;
  allFavorites = allFavorites;

  constructor(
    private modalCtrl: ModalController,
    private api: ShroomShareApiService,
    private fav: StorageService,
    storage: Storage
  ) {
    super(storage, params(defaultState), tmpState);
    this.getUsers = this.getUsersFunc(this.api);
    this.getSpecies = this.getSpeciesFunc(this.api);
    this.fav.getFavorites().subscribe({
      next: (list) => {
        if (list !== null) {
          this.allFavorites = list as User[];
          const state = () => getDefaultState(list);
          this.setState(params(state));
        } else {
          this.allFavorites = [];
          const state = () => getDefaultState([]);
          this.setState(params(state));
        }
      },
    });
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
