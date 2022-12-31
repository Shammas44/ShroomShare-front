import { Component, OnInit, Input } from '@angular/core';
import { Mushroom, MushroomPicture, MushroomWithPic } from '../../models/mushrooms';
import { Specy } from '../../models/species';

@Component({
  selector: 'app-mushroom-card',
  templateUrl: './mushroom-card.component.html',
  styleUrls: ['./../card.component.scss'],
})
export class MushroomCardComponent implements OnInit {
  @Input() mushroom: MushroomWithPic | null = null;
  showFullText: boolean = false;
  constructor() {}

  ngOnInit() {}

  onToggleTextExpand() {
    this.showFullText = this.showFullText ? false : true;
  }

  getPicture(picture: string | MushroomPicture) {
    if (typeof picture === 'string') {
      return picture;
    }
    return picture?.value ?? '';
  }
}
