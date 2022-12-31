import { Component, OnInit, Input } from '@angular/core';
import { Specy, SpecyPicture } from '../../models/species';

@Component({
  selector: 'app-specy-card',
  templateUrl: './specy-card.component.html',
  styleUrls: ['./../card.component.scss'],
})
export class SpecyCardComponent implements OnInit {
  @Input() specy: Specy | null = null;
  showFullText: boolean = false;
  constructor() {}

  ngOnInit() {}

  onToggleTextExpand() {
    this.showFullText = this.showFullText ? false : true;
  }

  getPicture(picture: string | SpecyPicture | undefined): string {
    if (typeof picture === 'undefined') {
      return '';
    }
    if (typeof picture === 'string') {
      return picture;
    }
    return picture?.value ?? '';
  }
}
