import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, from, ReplaySubject, BehaviorSubject, tap } from 'rxjs';
import { Favorite } from '../models/favorite';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _favoriteList$ = new BehaviorSubject<Favorite[]>([]);

  #storage = new ReplaySubject<Storage>(1);

  constructor(private storage: Storage) {
    this.storage.create().then((storage) => this.#storage.next(storage));
    this.getFavoritesList();
  }

  get<T = unknown>(key: string): Observable<T> {
    return this.#storage.pipe(switchMap((storage) => from(storage.get(key))));
  }

  set(key: string, value: unknown): Observable<void> {
    return this.#storage.pipe(switchMap((storage) => from(storage.set(key, value))));
  }

  remove(key: string): void {
    this.#storage.subscribe((storage) => storage.remove(key));
  }

  isFavorite(id: string | undefined) {
    let isfav = false;
    this.getFavorites().subscribe((FavoriteList) => {
      FavoriteList.forEach((favorite: Favorite) => {
        if (favorite.id === id) {
          isfav = true;
        }
      });
      return isfav;
    });
  }

  getFavorites(): Observable<Favorite[]> {
    return this.get('favorites');
  }

  get favoriesList$() {
    return this._favoriteList$.asObservable();
  }

  getFavoritesList() {
    this.get<Favorite[]>('favorites')
      .pipe(tap((favlist: Favorite[]) => this._favoriteList$.next(favlist)))
      .subscribe();
  }

  deleteFavorite2(id: any) {
    this._favoriteList$.subscribe((values) => {});
    let index = -1;
    this._favoriteList$.subscribe((favoritesList) => {
      favoritesList.forEach((favorite: Favorite, i: any) => {
        if (favorite.id == id) {
          index = i;
        }
      });
      if (index > -1) {
        favoritesList.splice(index, 1);
        this.set('favorites', favoritesList).subscribe();
      }
    });
  }

  addFavorite2(value: any) {
    this._favoriteList$.subscribe((val) => {
      if (val == null) {
        this.set('favorites', [value]).subscribe();
      } else {
        let listfilter = val.filter((x: any) => x.id === value.id);
        if (listfilter.length == 0) {
          val.push(value);
          this.set('favorites', val).subscribe();
        }
      }
    });
  }

  public deleteFaovrite(id: string) {
    let index = -1;

    this.getFavorites().subscribe((favoritesList) => {
      favoritesList.forEach((favorite: Favorite, i: any) => {
        if (favorite.id == id) {
          index = i;
        }
      });
      if (index > -1) {
        favoritesList.splice(index, 1);
        this.set('favorites', favoritesList).subscribe();
      }
    });
    return this.#storage.subscribe();
  }
}
