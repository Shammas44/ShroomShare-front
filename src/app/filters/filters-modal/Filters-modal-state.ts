import { Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage';
import { storageKeys } from '../../models/standard';

export class FiltersModalState {

  constructor(private storage: Storage, ) {}

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
