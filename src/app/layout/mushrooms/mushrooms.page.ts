import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { FiltersModalComponent } from '../../filters/filters-modal/filters-modal.component';
import { MushroomsFilter, Mushroom } from '../../models/mushrooms';

@Component({
  selector: 'app-mushrooms',
  templateUrl: './mushrooms.page.html',
  styleUrls: ['./mushrooms.page.scss'],
}) // eslint-disable-line
export class MushroomsPage implements OnInit {
  mushrooms: Mushroom[] = [];
  constructor(private modalCtrl: ModalController, private api: ShroomShareApiService) {
    this.fetchMushrooms({});
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FiltersModalComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    const form: FiltersModalComponent = data;
    // console.log({ data, role });
    if (data) this.fetchMushrooms(form);
  }

  fetchMushrooms(form: any) {
    const option = {
      showPictures: true,
      currentPage: 1,
      pageSize: 5,
    };
    this.api.getMushrooms$(option).subscribe({
      next: (res) => {
        this.mushrooms = [];
        for (const mushroom of res.items as Mushroom[]) {
          this.mushrooms.push(mushroom);
        }
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  ngOnInit() {}
}
