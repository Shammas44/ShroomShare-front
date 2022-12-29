import { Component, OnInit, Input } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { FiltersModalComponent } from '../../filters/filters-modal/filters-modal.component';
import { modalRole } from '../../models/modal';
import { Storage } from '@ionic/storage';
import { PaginatedFilters } from '../../models/filters';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/models/response';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss'],
})
export class CardsListComponent<Item, State extends { [index: string]: any }> implements OnInit {
  items: Item[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  pageSize: number = 5;
  filters: PaginatedFilters = {};
  @Input() private getItems$!: (filters: PaginatedFilters) => Observable<PaginatedResponse<Item>>;
  // actual value is: getMushrooms-request-params
  @Input() private storageRequestParamKey!: string;
  @Input() private fromModaResponseToApiParams!: (modalData: State) => PaginatedFilters;

  ngOnInit() {}

  constructor(private modalCtrl: ModalController, private storage: Storage) {
    this.storage
      .get(this.storageRequestParamKey)
      .then((filters) => {
        filters ? this.fetchItems(filters) : this.fetchItems({});
      })
      .catch(() => {
        this.fetchItems({});
      });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FiltersModalComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === modalRole.confirm) {
      const params = this.fromModaResponseToApiParams(data);
      this.storage.set(this.storageRequestParamKey, params);
      this.filters = params;
      this.currentPage = 1;
      this.lastPage = 1;
      this.fetchItems(params);
    }
  }

  onIonInfinite(event: Event) {
    this.addItems();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  // private fromModalResponseToApiParams(data: TmpState): PaginatedFilters {
  //   const params = {} as PaginatedFilters;
  //   const userIds = concat(data.users?.chips, 'id');
  //   if (userIds) params.userIds = userIds;
  //   const speciesIds = concat(data.species?.chips, 'id');
  //   if (speciesIds) params.specyIds = speciesIds;
  //   const usages = concat(data.usages, 'name');
  //   if (usages) params.usages = usages;
  //   params.radius = data.radius;
  //   params.from = new Date(data.start).toISOString();
  //   params.to = new Date(data.end).toISOString();
  //   return params;
  // }

  private addItems() {
    if (this.currentPage >= this.lastPage) return;
    this.currentPage++;
    this.fetchItems(this.filters);
  }

  private fetchItems(params: PaginatedFilters) {
    const defaultParams = {
      showPictures: true,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    };
    const options = Object.assign(params, defaultParams);
    this.getItems$(options).subscribe({
      next: (res) => {
        this.items = [];
        this.lastPage = res.lastPage;
        this.currentPage = res.currentPage;
        for (const item of res.items as Item[]) {
          this.items.push(item);
        }
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }
}
