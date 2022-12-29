import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { FiltersModalComponent } from '../../filters/filters-modal/filters-modal.component';
import { TmpState } from '../../models/filters';
import { MushroomsFilter, Mushroom, MushroomWithPic } from '../../models/mushrooms';
import { CustomMap, storageKeys } from '../../models/standard';
import { modalRole } from '../../models/modal';
import { Specy } from '../../models/species';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-mushrooms',
  templateUrl: './mushrooms.page.html',
  styleUrls: ['./mushrooms.page.scss'],
})
export class MushroomsPage implements OnInit {
  mushrooms: MushroomWithPic[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  pageSize: number = 5;
  filters: MushroomsFilter = {};
  species: CustomMap<Specy> = new Map();

  ngOnInit() {}

  constructor(
    private modalCtrl: ModalController,
    private api: ShroomShareApiService,
    private storage: Storage
  ) {
    this.storage
      .get(storageKeys.species)
      .then((res) => {
        this.species = res;
      })
      .then(() => {
        this.storage
          .get('getMushrooms-request-params')
          .then((filters) => {
            filters ? this.fetchMushrooms(filters) : this.fetchMushrooms({});
          })
          .catch(() => {
            this.fetchMushrooms({});
          });
      });
  }

  getSpecy(key: string | Specy) {
    if (typeof key === 'string') {
      return this.species.get(key);
    }
    return this.species.get(key.id);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FiltersModalComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === modalRole.confirm) {
      const params = this.fromModalResponseToApiParams(data);
      this.storage.set('getMushrooms-request-params', params);
      this.filters = params;
      console.log({ params });
      this.currentPage = 1;
      this.lastPage = 1;
      this.fetchMushrooms(params);
    }
  }

  onIonInfinite(event: Event) {
    this.addItems();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  private fromModalResponseToApiParams(data: TmpState): MushroomsFilter {
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
      return result.slice(0, -1) || undefined;
    }
  }

  private addItems() {
    if (this.currentPage >= this.lastPage) return;
    this.currentPage++;
    this.fetchMushrooms(this.filters);
  }

  private fetchMushrooms(params: MushroomsFilter) {
    const defaultParams = {
      showPictures: true,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    };
    const options = Object.assign(params, defaultParams);
    this.api.getMushrooms$(options).subscribe({
      next: (res) => {
        this.mushrooms = [];
        this.lastPage = res.lastPage;
        this.currentPage = res.currentPage;
        for (const mushroom of res.items as MushroomWithPic[]) {
          this.mushrooms.push(mushroom);
        }
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }
}
