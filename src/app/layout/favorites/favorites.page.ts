import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/localStorage/local-storage.service';
import {Observable, of} from "rxjs";
import { Favorite } from 'src/app/models/favorite';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

 //FavoritesList$: Observable<any[]>;
 favoriteslist: Favorite[];
 //itemlist: any = []
  constructor(private localStorage: LocalStorageService, private storage: Storage) {  
    // this.localStorage.get("favorites").then((favorites)=>{
    //   console.log("ici", favorites);
    //})
   }
  
   public isfavorites: boolean = false;
  ngOnInit() {

this.storage.get("favorites").then((res)=>{
if(res===null){
  
}else{
  this.favoriteslist = res;
  this.isfavorites=true;
  console.log(res[0].username);
}
})
   
  }
  
functiontest() {
  this.localStorage.encore();
  this.isfavorites = true;
}

  deleteFavorite(key: string, id: string){
    this.localStorage.deleteFavorite(key, id);
  }

  //public favoriteslist = await this.localStorage.get("favorites");

  getFavorites$(): Observable<Favorite[]> {
    return this.localStorage.getFavorites$() as Observable<Favorite[]>;
  }

 

 
 //public favoriteList = this.getFavorites$();

}
