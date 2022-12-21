import { Observable, from } from 'rxjs';
import { PickerState } from '../../models/picker';
import { Usage } from '../../models/usages';
import { CustomMap } from '../../models/standard';
import { Storage } from '@ionic/storage';

export class UsageMap extends Map<string, UsageState> {}

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

type UsageState = {
  name: string;
  checked: boolean;
};

export class FiltersModalState {
  stateKey: string;

  constructor(private storage: Storage, stateKey: string) {
    this.stateKey = stateKey;
  }
  setProperty<T>(key: string, getDefaultState: () => Observable<T> | T) {
    return from(
      this.storage.get(`${this.stateKey}-${key}`).then((value) => value || getDefaultState())
    );
  }
  getKeys(): string[] {
    const noneReturnableKeys = ['stateKey', 'storage'];
    const keys = Object.getOwnPropertyNames(this);
    const values: string[] = [];
    keys.forEach((key) => {
      if (!noneReturnableKeys.includes(key)) values.push(`${this.stateKey}-${key}`);
    });
    return values;
  }
}
