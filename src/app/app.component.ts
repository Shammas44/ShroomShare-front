import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
}) // eslint-disable-line
export class AppComponent {
  constructor(storage: Storage) {
    storage.create();
  }
}
