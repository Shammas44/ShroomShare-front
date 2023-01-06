import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, from } from 'rxjs';
import { Favorite } from '../models/favorite';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) { 
    this.init();
  }


  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }


  public async add(key: string, value: any){

    if(await this._storage?.get(key)==null){
      this._storage?.set(key, [value]);
    }else{
    const list= await this._storage?.get(key);

    const listfilter = list.filter((x:any) => x.id === value.id)
   
    if(listfilter.length==0){
      list.push(value);
      this._storage?.set(key, list);
    }
  }
  }

  public async deleteFavorite(key: string, id: string){
    const list = await this._storage?.get(key);
    let index = -1;
    list.forEach((element:any, i:any) => {
      if(element.id==id){
        index=i;
      }
    });
    if(index>-1){
      list.splice(index,1)
      console.log(list)
      this._storage?.set(key,list);
    }
    
    // const listfilter = list.filter((x:any) => x.id === id)
    // console.log("dans deletfav2",listfilter);
    // if(listfilter.length==1){
    //   console.log("ah bon?");
    //   const iselement = (element:any) => element === listfilter;
    //   const index = list.findIndex(iselement);
    //   console.log("index", index);
    //   list.slice(index);
    //   console.log("la liste slice", list);
    //   this._storage?.set(key, list);
    // }
  }

  //:Promise<JSON>

  public async get(key: string){
    return await this._storage?.get(key)
  }

  test(key:string): any | undefined {
    console.log("ooui");
    const favs = this._storage?.get("favorites").then((favors)=>{
      console.log(favors);
    })
    return this._storage?.get("favorites")
  }
  result = [];
  encore(){
  let promise =  this._storage?.get("favorites").then((res)=>{
      this.result = res
    })
    return promise
  }

  async merde() {
      let itemlist = await this._storage?.get("favorites");
      return itemlist
    }
    
  

  getFavorites$(): Observable<Favorite[]> {
    return this._storage?.get("favorites") as any;
  }

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
