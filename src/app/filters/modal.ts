import { ChoosenItem } from '../models/standard';
import { ShroomShareApiService } from '../utils/shroom-share-api.service';
import { Observable } from 'rxjs';
import { User, UserFilter } from '../models/users';
import { PaginatedResponse } from '../models/response';
import { Specy, SpeciesFilter } from '../models/species';
import { PickerCityState, PickerState } from '../models/picker';
import { Storage } from '@ionic/storage';
import { FiltersModalState, StateParams } from './Filters-modal-state';
import { UsageMap, TmpState } from '../models/filters';
import { RangeValue } from '@ionic/core';

const currentDate = new Date();
const previousYearDate = new Date();
previousYearDate.setFullYear(currentDate.getFullYear() - 1);

export abstract class Modal {
  protected states!: FiltersModalState;
  protected tmpState: TmpState;
  abstract cancel(): Promise<boolean>;
  abstract confirm(): Promise<boolean>;
  abstract getUsers: (option: UserFilter) => Observable<PaginatedResponse<User>>;
  abstract getSpecies: (option: SpeciesFilter) => Observable<PaginatedResponse<Specy>>;
  currentDate: string;
  usages: UsageMap = new UsageMap();
  users: ChoosenItem[] = [];
  species: ChoosenItem[] = [];
  userKeys = { id: 'id', searchable: 'username' };
  specyKeys = { id: 'id', searchable: 'name' };
  rangeValue!: RangeValue;
  abstract allFavorites: User[];

  constructor(protected storage: Storage, params: StateParams[], tmpState: TmpState) {
    this.states = new FiltersModalState(this.storage, params);
    this.tmpState = tmpState;
    this.currentDate = new Date().toISOString();
    this.setTmpState();
  }

  setState(params: StateParams[]) {
    this.states = new FiltersModalState(this.storage, params);
  }

  private setTmpState() {
    const iterable = this.states.getKeys();
    for (const value of iterable) {
      let keys = value.split('-');
      const key = keys[keys.length - 1];
      this.storage.get(value).then((res) => {
        if (res) this.tmpState[key] = res;
      });
    }
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  onChoosenCity(state: PickerCityState) {
    this.tmpState.city = state;
  }

  onRadiusChange(e: Event) {
    const event = e as CustomEvent;
    this.tmpState.radius = event.detail.value;
    this.rangeValue = event.detail.value;
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const usage = event.detail.value;
    const isChecked = event.detail.checked;
    const { name, value } = usage;
    this.tmpState?.usages?.set(name, { name, checked: isChecked, value });
  }

  protected getUsersFunc(
    api: ShroomShareApiService
  ): (option: UserFilter) => Observable<PaginatedResponse<User>> {
    return (option: UserFilter): Observable<PaginatedResponse<User>> => {
      return api.getUsers$(option);
    };
  }

  protected getSpeciesFunc(
    api: ShroomShareApiService
  ): (option: SpeciesFilter) => Observable<PaginatedResponse<Specy>> {
    return (option: SpeciesFilter): Observable<PaginatedResponse<Specy>> => {
      return api.getSpecies$(option);
    };
  }
}
