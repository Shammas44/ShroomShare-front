import { Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage';

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
