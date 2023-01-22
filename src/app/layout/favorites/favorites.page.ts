import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/localStorage/local-storage.service';
import { concat, delay, Observable, of } from 'rxjs';
import { Favorite } from 'src/app/models/favorite';
import { Storage } from '@ionic/storage-angular';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  //FavoritesList$: Observable<any[]>;
  favoriteslist$: Observable<Favorite[]>;
  _favoritesList$: Observable<Favorite[]>;
  //itemlist: any = []
  constructor(
    private favoriteStorage: StorageService,
    private modalController: ModalController,
    private storage: Storage,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    //this.favoriteslist$ = this.favoriteStorage.getFavorites();
    this._favoritesList$ = this.favoriteStorage.favoriesList$;
    //console.log('fav2', this.favoriteslist$);
  }

  // async deleteFavorite(id: string) {
  //   this.favoriteStorage.deleteFaovrite(id);
  //   const alert = await this.alertController.create({
  //     header: `Are you sure you want to delete this user`,
  //     buttons: ['Yes', 'no'],
  //   });
  //   await alert.present();
  //   this.favoriteslist$ = this.favoriteStorage.getFavorites();
  // }

  async deleteFavorite2(id: string) {
    const alert = await this.alertController.create({
      header: `Are you sure you want to delete this user?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'primary',
        },
        {
          text: 'Delete',
          role: 'delete',
          cssClass: 'alert-button-delete',
          handler: () => {
            this.favoriteStorage.deleteFavorite2(id);
          },
        },
      ],
    });
    await alert.present();
  }
}
