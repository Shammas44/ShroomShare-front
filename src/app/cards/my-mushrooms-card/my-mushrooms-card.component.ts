import { Component, OnInit, Input } from '@angular/core';
import { MushroomPicture, MushroomWithPic } from 'src/app/models/mushrooms';

@Component({
  selector: 'app-my-mushrooms-card',
  templateUrl: './my-mushrooms-card.component.html',
  styleUrls: ['./../card.component.scss'],
})
export class MyMushroomsCardComponent implements OnInit {
  @Input() mushroom: MushroomWithPic | null = null;
  showFullText: boolean = false;
  constructor() {}

  ngOnInit() {}

  onToggleTextExpand() {
    this.showFullText = this.showFullText ? false : true;
  }

  modifyMushroom(){}

  deleteMushroom(){}

  getPicture(picture: string | MushroomPicture) {
    if (typeof picture === 'string') {
      return picture;
    }
    return picture?.value ?? '';
  }
}
