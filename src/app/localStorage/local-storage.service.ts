import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, from, ReplaySubject } from 'rxjs';
import { Favorite } from '../models/favorite';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // private _storage: Storage | null = null;

  #storage = new ReplaySubject<Storage>(1);

  constructor(private storage: Storage) {
    this.storage.create().then((storage) => this.#storage.next(storage));
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

  // public async add(key: string, value: any) {
  //   if ((await this._storage?.get(key)) == null) {
  //     this._storage?.set(key, [value]);
  //   } else {
  //     const list = await this._storage?.get(key);

  //     const listfilter = list.filter((x: any) => x.id === value.id);

  //     if (listfilter.length == 0) {
  //       list.push(value);
  //       this._storage?.set(key, list);
  //     }
  //   }
  // }
  isFavorite(id: string | undefined): any {
    let isfav = false;
    this.getFavorites().subscribe((FavoriteList) => {
      FavoriteList.forEach((favorite: Favorite) => {
        if (favorite.id == id) {
          console.log("C'est fav");
          isfav = true;
        }
      });
      return isfav;
    });
  }

  getFavorites(): Observable<Favorite[]> {
    return this.get('favorites');
  }

  public addFavorite(value: any) {
    //let favoritesList = this.getFavorites().subscribe();
    this.getFavorites().subscribe((val) => {
      console.log(val);
      if (val == null) {
        console.log('oui');
        this.set('favorites', [value]).subscribe();
      } else {
        let listfilter = val.filter((x: any) => x.id === value.id);
        console.log('la list filter', listfilter);
        if (listfilter.length == 0) {
          val.push(value);
          this.set('favorites', val).subscribe();
        }

        //const listfilter = favoritesList.filter((x: any) => x.id === value.id);
      }
    });
    //console.log('favlist', favoritesList);
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

  // public async deleteFavorite(key: string, id: string) {
  //   const list = await this._storage?.get(key);
  //   let index = -1;
  //   list.forEach((element: any, i: any) => {
  //     if (element.id == id) {
  //       index = i;
  //     }
  //   });
  //   if (index > -1) {
  //     list.splice(index, 1);
  //     console.log(list);
  //     this._storage?.set(key, list);
  //   }

  //   // const listfilter = list.filter((x:any) => x.id === id)
  //   // console.log("dans deletfav2",listfilter);
  //   // if(listfilter.length==1){
  //   //   console.log("ah bon?");
  //   //   const iselement = (element:any) => element === listfilter;
  //   //   const index = list.findIndex(iselement);
  //   //   console.log("index", index);
  //   //   list.slice(index);
  //   //   console.log("la liste slice", list);
  //   //   this._storage?.set(key, list);
  //   // }
  // }

  //:Promise<JSON>

  // public async get(key: string){
  //   return await this._storage?.get(key)
  // }

  // test(key: string): any | undefined {
  //   console.log('ooui');
  //   const favs = this._storage?.get('favorites').then((favors) => {
  //     console.log(favors);
  //   });
  //   return this._storage?.get('favorites');
  // }
  // result = [];
  // encore() {
  //   let promise = this._storage?.get('favorites').then((res) => {
  //     this.result = res;
  //   });
  //   return promise;
  // }

  // async merde() {
  //     let itemlist = await this._storage?.get("favorites");
  //     return itemlist
  //   }

  // getObserv(): Observable<Favorite[]> {
  //   let FavoriteList = this._storage?.get("Favorites");
  //   let FavoritesListObservable = from(FavoriteList);
  //   return this._storage?.get("Favorites").map( res =>{
  //     let result = res;
  //     return result;
  //   })
  // }

  // getFavorites$(key:string): Observable<Favorite[]>{
  //     return this._storage?.get()
  //   }
}
