import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { FiltersModalComponent } from '../../filters/filters-modal/filters-modal.component';
import { TmpState } from '../../models/filters';
import { MushroomsFilter, Mushroom } from '../../models/mushrooms';
import { CustomMap } from '../../models/standard';

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
    const params = this.fromModalResponseToApiParams(data);
    console.log({ params });
    if (data) this.fetchMushrooms(params);
  }

  fromModalResponseToApiParams(data: TmpState): MushroomsFilter {
    const params = {} as MushroomsFilter;
    const userIds = concat(data.users?.chips, 'id');
    if (userIds) params.userIds = userIds;
    const speciesIds = concat(data.species?.chips, 'id');
    if (speciesIds) params.specyIds = speciesIds;
    const usages = concat(data.usages, 'name');
    if (usages) params.usages = usages;
    params.radius = data.radius;
    params.from = new Date(data.start).toISOString();
    params.to = new Date(data.end).toISOString();
    return params;

    function concat<U extends { [index: string]: any }, T extends CustomMap<U>>(
      data: T | undefined | null,
      id: string
    ) {
      let result = '';
      if (data) {
        const iterator = data.values();
        for (const value of iterator) {
          if (id) result += `${value[id]},`;
        }
      }
      return result.slice(0,-1) || undefined;
    }
  }

  fetchMushrooms(params: MushroomsFilter) {
    const defaultParams = {
      showPictures: true,
      currentPage: 1,
      pageSize: 5,
    };
    const options = Object.assign(params, defaultParams);
    this.api.getMushrooms$(options).subscribe({
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
