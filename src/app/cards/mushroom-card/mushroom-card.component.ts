import { Component, OnInit, Input } from '@angular/core';
import { MushroomPicture, MushroomWithPic } from '../../models/mushrooms';
//import { LocalStorageService } from 'src/app/localStorage/local-storage.service';
import { Router } from '@angular/router';
import { StorageService } from './../../localStorage/local-storage.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mushroom-card',
  templateUrl: './mushroom-card.component.html',
  styleUrls: ['./../card.component.scss'],
})
export class MushroomCardComponent implements OnInit {
  @Input() mushroom: MushroomWithPic | null = null;
  showFullText: boolean = false;
  constructor(
    private LocalStorage: StorageService,
    private toastController: ToastController,
    private route: Router
  ) {}
  isfav = false;
  ngOnInit() {
    console.log('le mushroom', this.mushroom?.user?.id);
    this.LocalStorage.getFavorites().subscribe((FavoriteList) => {
      FavoriteList.forEach((favorite: any) => {
        if (favorite.id == this.mushroom?.user?.id) {
          console.log("C'est fav");
          this.isfav = true;
        }
      });
    });
    console.log('isfav?', this.isfav);
  }

  onToggleTextExpand() {
    this.showFullText = this.showFullText ? false : true;
  }

  async addToFavorites(mushroom: null | MushroomWithPic) {
    this.LocalStorage.addFavorite({
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
  }

  getPicture(picture: string | MushroomPicture) {
    if (typeof picture === 'string') {
      return picture;
    }
    return picture?.value ?? '';
  }

  navToWiki() {
    this.route.navigate(['wiki']);
  }
}
