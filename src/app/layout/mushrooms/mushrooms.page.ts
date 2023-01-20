import { Component, OnInit } from '@angular/core';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { TmpState } from '../../models/filters';
import { MushroomsFilter, MushroomWithPic } from '../../models/mushrooms';
import { PaginatedResponse } from 'src/app/models/response';
import { Observable } from 'rxjs';
import { CardList } from '../../cards/cards-list/cards-list';
import { storageKeys } from '../../models/standard';
import { ModalController } from '@ionic/angular';
import { modalRole } from '../../models/modal';
import { Storage } from '@ionic/storage';
import { FiltersModalMushroomComponent } from 'src/app/filters/filters-modal-mushroom/filters-modal-mushroom.component';
import { setApiParams } from '../../utils/modal-utility-functions';

const currentDate = new Date();
const previousYearDate = new Date();
previousYearDate.setFullYear(currentDate.getFullYear() - 1);

@Component({
  selector: 'app-mushrooms',
  templateUrl: './mushrooms.page.html',
  styleUrls: ['./mushrooms.page.scss'],
})
export class MushroomsPage extends CardList<MushroomWithPic> implements OnInit {
  storageRequestParamKey: string = storageKeys.getMushroomsRequestParams;

  ngOnInit() {
    this.initalItemSetting();
  }

  constructor(
    private api: ShroomShareApiService,
    storage: Storage,
    private modalCtrl: ModalController
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
      console.log({ filters: params });
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
