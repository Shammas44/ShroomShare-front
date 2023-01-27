import { Component, OnInit, Input } from '@angular/core';
import { MushroomPicture, MushroomWithPic } from '../../models/mushrooms';
//import { LocalStorageService } from 'src/app/localStorage/local-storage.service';
import { StorageService } from './../../localStorage/local-storage.service';
import { ToastController } from '@ionic/angular';
import { Favorite } from 'src/app/models/favorite';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mushroom-card',
  templateUrl: './mushroom-card.component.html',
  styleUrls: ['./../card.component.scss'],
})
export class MushroomCardComponent implements OnInit {
  @Input() mushroom: MushroomWithPic | null = null;
  showFullText: boolean = false;

  _favoritesList$: Observable<Favorite[]>;

  constructor(private favoriteStorage: StorageService, private toastController: ToastController) {}
  isfav = false;
  ngOnInit() {
    this._favoritesList$ = this.favoriteStorage.favoriesList$;

    this._favoritesList$.subscribe((a) => {
      console.log('oui', a);
    });
    this.isFav();

    // console.log('le mushroom', this.mushroom?.user?.id);
    // this._favoritesList$.subscribe((FavoriteList) => {
    //   FavoriteList.forEach((favorite: any) => {
    //     if (favorite.id == this.mushroom?.user?.id) {
    //       console.log("C'est fav");
    //       this.isfav = true;
    //     }
    //   });
    // });
    // console.log('isfav?', this.isfav);
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

      const toast = await this.toastController.create({
        message: `${mushroom?.user?.username} has been added to favorites`,
        duration: 1500,
        position: 'bottom',
      });

      await toast.present();
    } else {
      this.isfav = false;
      const id = this.mushroom?.user?.id;
      this.favoriteStorage.deleteFavorite2(id);
    }
  }

  getPicture(picture: string | MushroomPicture) {
    if (typeof picture === 'string') {
      return picture;
    }
    return picture?.value ?? '';
  }

  isFav() {
    console.log('oui?????');
    this._favoritesList$.subscribe((r) => {
      r.forEach((element) => {
        if (element.id === this.mushroom?.user?.id) {
          this.isfav = true;
          console.log("c'est true");
        }
      });
    });
  }
}
