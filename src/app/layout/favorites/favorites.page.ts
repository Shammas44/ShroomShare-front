import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/localStorage/local-storage.service';
import { IonAccordionGroup } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Favorite } from 'src/app/models/favorite';
import { AlertController, ToastController } from '@ionic/angular';
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
  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;
  presentToast: (options: ToastOptions | string) => void;
  favoritesList$: Observable<Favorite[]>;
  resultList: Observable<User[]>;
  search: string = '';
  currentFavList: Favorite[];

  constructor(
    private favoriteStorage: StorageService,
    private alertController: AlertController,
    private api: ShroomShareApiService,
    private toastController: ToastController
  ) {
    this.presentToast = getPresentToastFunc(this.toastController);
    this.favoritesList$ = this.favoriteStorage.getFavorites();
  }

  onInputChange(event: Event) {
    const e = event as CustomEvent;
    const accordionGroup = this.accordionGroup?.value?.includes('favorites') ? ['favorites'] : [];
    let searchInput = e.detail.value;
    this.resultList = new Observable<[]>();
    if (searchInput === '') {
      if (this.accordionGroup) this.accordionGroup.value = accordionGroup;
    } else {
      this.resultList = this.api
        .getUsers$({ search: searchInput })
        .pipe(map<PaginatedResponse<User>, User[]>((PaginatedResp) => PaginatedResp.items));
    }
    this.resultList.subscribe({
      next: (users) => {
        if (users !== null) {
          if (users.length > 0) this.accordionGroup.value = [...accordionGroup, 'all'];
        }
      },
    });
  }

  ngOnInit() {
    this.accordionGroup.value = ['favorites'];
    this.favoritesList$.subscribe((res) => {
      this.currentFavList = res;
    });
  }

  isFavorite(user: User) {
    return this.currentFavList.some((r) => r.id === user.id);
  }

  addToFavorite(user: User) {
    this.favoriteStorage.addFavorite2({
      id: user?.id,
      username: user?.username,
    });
    this.currentFavList.push({ id: user?.id, username: user?.username });
    this.presentToast({
      message: `${user?.username} a été ajouté a vos favoris`,
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
            let index = this.currentFavList.indexOf(favorite);
            this.currentFavList.splice(index, 1);
            this.presentToast({
              message: `${favorite.username} a été retiré de vos favoris`,
              icon: ToastTypes.success,
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
