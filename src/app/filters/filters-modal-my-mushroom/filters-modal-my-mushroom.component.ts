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

const dates = getDate();

const params: StateParams[] = [
  { key: 'species', storageKey: storageKeys.filterModalMySpecies, defaultValue: getDefaultState },
  {
    key: 'usages',
    storageKey: storageKeys.filterModalMyUsages,
    defaultValue: getDefaultUsageState,
  },
  {
    key: 'start',
    storageKey: storageKeys.filterModalMyStart,
    defaultValue: () => dates.prevYearDateIso,
  },
  {
    key: 'end',
    storageKey: storageKeys.filterModalMyEnd,
    defaultValue: () => dates.currentDateIso,
  },
];

const tmpState: TmpState = {
  species: null,
  usages: getDefaultUsageState(),
  start: dates.prevYearDateIso,
  end: dates.currentDateIso,
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
