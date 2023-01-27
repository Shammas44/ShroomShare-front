import { Component, OnInit, Input } from '@angular/core';
import { MushroomPicture, MushroomWithPic } from '../../models/mushrooms';
//import { LocalStorageService } from 'src/app/localStorage/local-storage.service';
import { StorageService } from './../../localStorage/local-storage.service';
import { ToastController } from '@ionic/angular';
import { Favorite } from 'src/app/models/favorite';
import { Observable } from 'rxjs';
import { getPresentToastFunc, ToastTypes } from 'src/app/utils/utility-functions';
import { ToastOptions } from 'src/app/utils/utility-functions';

@Component({
  selector: 'app-mushroom-card',
  templateUrl: './mushroom-card.component.html',
  styleUrls: ['./../card.component.scss'],
})
export class MushroomCardComponent implements OnInit {
  presentToast: (options: ToastOptions | string) => void;
  @Input() mushroom: MushroomWithPic | null = null;
  showFullText: boolean = false;

  _favoritesList$: Observable<Favorite[]>;

  constructor(private favoriteStorage: StorageService, private toastController: ToastController) {
    this.presentToast = getPresentToastFunc(this.toastController);
  }
  isfav = false;
  ngOnInit() {
    this._favoritesList$ = this.favoriteStorage.favoriesList$;

    this._favoritesList$.subscribe((a) => {
      console.log('oui', a);
    });
    this.isFav();
  }

  onToggleTextExpand() {
    this.showFullText = this.showFullText ? false : true;
  }

  async addToFavorites(mushroom: null | MushroomWithPic) {
    if (!this.isfav) {
      this.favoriteStorage.addFavorite2({
        id: mushroom?.user?.id,
        username: mushroom?.user?.username,
      });
      this.isfav = true;

      this.presentToast({
        message: `${mushroom?.user?.username} a été ajouté a vos faovris`,
        icon: ToastTypes.success,
      });
    } else {
      this.isfav = false;
      const id = this.mushroom?.user?.id;
      this.favoriteStorage.deleteFavorite2(id);

      this.presentToast({
        message: `${mushroom?.user?.username} a été retiré de vos faovris`,
        icon: ToastTypes.success,
      });
    }
  }

  getPicture(picture: string | MushroomPicture) {
    if (typeof picture === 'string') {
      return picture;
    }
    return picture?.value ?? '';
  }

  isFav() {
    this._favoritesList$.subscribe((r) => {
      r.forEach((element) => {
        if (element.id === this.mushroom?.user?.id) {
          this.isfav = true;
        }
      });
    });
  }
}
