import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FiltersModalComponent } from '../../filters/filters-modal/filters-modal.component';

@Component({
  selector: 'app-mushrooms',
  templateUrl: './mushrooms.page.html',
  styleUrls: ['./mushrooms.page.scss'],
}) // eslint-disable-line
export class MushroomsPage implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FiltersModalComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }


  ngOnInit() {}
}
