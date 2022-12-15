import { Component, OnInit, Input } from '@angular/core';
import { Mushroom } from '../../models/mushrooms';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
}) // eslint-disable-line
export class CardComponent implements OnInit {
  @Input() mushroom: Mushroom | null = null;
  constructor() {}

  ngOnInit() {}
}
