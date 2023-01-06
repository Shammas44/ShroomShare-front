import { Component, OnInit, Input } from '@angular/core';
import { Mushroom, MushroomPicture, MushroomWithPic } from '../../models/mushrooms';
//import { LocalStorageService } from 'src/app/localStorage/local-storage.service';
import { Specy } from '../../models/species';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/users';
import { LocalStorageService } from './../../localStorage/local-storage.service';

@Component({
  selector: 'app-mushroom-card',
  templateUrl: './mushroom-card.component.html',
  styleUrls: ['./../card.component.scss'],
})
export class MushroomCardComponent implements OnInit {
  @Input() mushroom: MushroomWithPic | null = null;
  showFullText: boolean = false;
  constructor(private LocalStorage: LocalStorageService) {}

  ngOnInit() {}

  onToggleTextExpand() {
    this.showFullText = this.showFullText ? false : true;
  }

  addToFavorites(mushroom:null|MushroomWithPic){
    //this.LocalStorage.encore();
    this.LocalStorage.add("favorites", {"id":mushroom?.user?.id, "username": mushroom?.user?.username})

  }

  getPicture(picture: string | MushroomPicture) {
    if (typeof picture === 'string') {
      return picture;
    }
    return picture?.value ?? '';
  }
}
