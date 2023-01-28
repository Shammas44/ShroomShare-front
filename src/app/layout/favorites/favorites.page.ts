import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/localStorage/local-storage.service';
import { concat, delay, Observable, of } from 'rxjs';
import { Favorite } from 'src/app/models/favorite';

import { AlertController, ModalController, ToastController } from '@ionic/angular';

import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { PaginatedResponse } from 'src/app/models/response';
import { User } from 'src/app/models/users';
import { map } from 'rxjs';
import { ToastOptions } from 'src/app/utils/utility-functions';
import { getPresentToastFunc } from 'src/app/utils/utility-functions';
import { ToastTypes } from 'src/app/utils/utility-functions';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  presentToast: (options: ToastOptions | string) => void;
  //FavoritesList$: Observable<any[]>;
  favoriteslist$: Observable<Favorite[]>;
  _favoritesList$: Observable<Favorite[]>;
  searchInput: string;
  usersList: any;
  searchItems: Observable<PaginatedResponse<User>>;
  resultList: Observable<User[]>;
  search: string = '';

  constructor(
    private favoriteStorage: StorageService,

    private alertController: AlertController,
    private api: ShroomShareApiService,
    private toastController: ToastController
  ) {
    this.presentToast = getPresentToastFunc(this.toastController);
  }

  onInputChange(event: Event) {
    const e = event as CustomEvent;
    this.searchInput = e.detail.value;
    console.log(this.searchInput);
    this.searchItems = this.api.getUsers$({ search: this.searchInput });
    this.resultList = this.api
      .getUsers$({ search: this.searchInput })
      .pipe(map<PaginatedResponse<User>, User[]>((PaginatedResp) => PaginatedResp.items));
  }

  ngOnInit() {
    //this.favoriteslist$ = this.favoriteStorage.getFavorites();
    this._favoritesList$ = this.favoriteStorage.favoriesList$;
    console.log('dans le OnInit', this._favoritesList$);
    this.getAllUser();
    // console.log('usrelis', this.usersList);

    //console.log('fav2', this.favoriteslist$);
  }

  getAllUser() {
    const filter = { search: 'user01' };
    // this.api.
    this.usersList = this.api.getUsers$(filter).subscribe((data) => {
      console.log('userlist data', data);
    });
  }

  isFavorite(user: User): boolean {
    let isfav = false;
    this._favoritesList$.subscribe((values) => {
      values.forEach((element) => {
        if (element.id === user.id) {
          isfav = true;
        }
      });
    });
    return isfav;
  }

  addToFavorite(user: User) {
    this.favoriteStorage.addFavorite2({
      id: user?.id,
      username: user?.username,
    });
    this.presentToast({
      message: `${user?.username} a été ajouté a vos faovris`,
      icon: ToastTypes.success,
    });
  }

  async deleteFavorite2(favorite: Favorite) {
    const alert = await this.alertController.create({
      header: `Voulez-vous vraiment supprimer cet utilisateur?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'alert-button-confirm',
        },
        {
          text: 'Supprimer',
          role: 'delete',
          cssClass: 'alert-button-delete',
          handler: () => {
            this.favoriteStorage.deleteFavorite2(favorite.id);
            this.presentToast({
              message: `${favorite.username} a été retiré de vos faovris`,
              icon: ToastTypes.success,
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
