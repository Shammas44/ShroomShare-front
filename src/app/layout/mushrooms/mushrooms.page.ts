import { Component, OnInit } from '@angular/core';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { TmpState } from '../../models/filters';
import { MushroomsFilter, MushroomWithPic } from '../../models/mushrooms';
import { PaginatedResponse } from 'src/app/models/response';
import { CardList } from '../../cards/cards-list/cards-list';
import { storageKeys } from '../../models/standard';
import { ModalController, ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { modalRole } from '../../models/modal';
import { Storage } from '@ionic/storage';
import { FiltersModalMushroomComponent } from 'src/app/filters/filters-modal-mushroom/filters-modal-mushroom.component';
import { setApiParams } from '../../utils/modal-utility-functions';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

const currentDate = new Date();
const previousYearDate = new Date();
previousYearDate.setFullYear(currentDate.getFullYear() - 1);
type SpecyId = {
  id: string;
};

@Component({
  selector: 'app-mushrooms',
  templateUrl: './mushrooms.page.html',
  styleUrls: ['./mushrooms.page.scss'],
})
export class MushroomsPage
  extends CardList<MushroomWithPic>
  implements OnInit, ViewDidLeave, ViewDidEnter
{
  storageRequestParamKey: string = storageKeys.getMushroomsRequestParams;
  oldItems!: MushroomWithPic[];

  ngOnInit(): void {
    this.initalItemSetting();
  }

  ionViewDidLeave(): void {}

  ionViewDidEnter(): void {
    const id = this.location.getState() as SpecyId;
    if (id.id) {
      this.oldItems = this.items;
      this.items = [];
      this.currentPage = 1;
      this.lastPage = 2;
      const filters = { specyIds: id.id } as MushroomsFilter;
      this.fetchItems(filters)?.subscribe(this.getSubscriber());
    } else {
      this.oldItems ? (this.items = this.oldItems) : this.initalItemSetting();
    }
  }

  constructor(
    private api: ShroomShareApiService,
    storage: Storage,
    private modalCtrl: ModalController,
    private location: Location
  ) {
    super(storage);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FiltersModalMushroomComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === modalRole.confirm) {
      const params = this.fromModaResponseToApiParams(data);
      this.items = [];
      this.storage.set(this.storageRequestParamKey, params);
      this.filters = params;
      this.currentPage = 1;
      this.lastPage = 2;
      this.fetchItems(params)?.subscribe(this.getSubscriber());
    }
  }

  getItems$(filters: MushroomsFilter): Observable<PaginatedResponse<MushroomWithPic>> {
    return this.api.getMushrooms$(filters) as Observable<PaginatedResponse<MushroomWithPic>>;
  }

  fromModaResponseToApiParams(data: TmpState): MushroomsFilter {
    return setApiParams(data);
  }
}
