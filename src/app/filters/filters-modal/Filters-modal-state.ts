import { Observable, from  } from 'rxjs';
import { Storage } from '@ionic/storage';
import { storageKeys } from '../../models/standard';
import { PickerState } from 'src/app/models/picker';
import { UsageMap } from 'src/app/models/filters';

export type StateParams = {
  key: 'users' | 'species' | 'usages' | 'start' | 'end' | 'radius';
  storageKey: storageKeys;
  defaultValue: () => unknown;
};

export class FiltersModalState {

  users?: Observable<PickerState>;
  species?: Observable<PickerState>;
  usages?: Observable<UsageMap>;
  radius?: Observable<number>;
  start?: Observable<string>;
  end?: Observable<string>;
  constructor(private storage: Storage, params: StateParams[]) {
    params.forEach((param) => {
      this[param.key] = this.setProperty(param.storageKey, param.defaultValue);
    });
  }

  setProperty<T>(key: storageKeys, getDefaultState: () => Observable<T> | T) {
    return from(
      this.storage.get(key).then((value) => value || getDefaultState())
    );
  }
  getKeys(): string[] {
    const noneReturnableKeys = ['storage'];
    const keys = Object.getOwnPropertyNames(this);
    const values: string[] = [];
    keys.forEach((key) => {
      if (!noneReturnableKeys.includes(key)) values.push(`filters-modal-${key}`);
    });
    return values;
  }
}
