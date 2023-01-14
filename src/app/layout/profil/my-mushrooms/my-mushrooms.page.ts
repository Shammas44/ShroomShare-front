import { Component, OnInit } from '@angular/core';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { TmpState } from '../../../models/filters';
import { MushroomsFilter, MushroomWithPic } from '../../../models/mushrooms';
import { PaginatedResponse } from 'src/app/models/response';
import { Observable } from 'rxjs';
import { CardList } from '../../../cards/cards-list/cards-list';
import { storageKeys } from '../../../models/standard';
import { ModalController } from '@ionic/angular';
import { modalRole } from '../../../models/modal';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { User } from 'src/app/models/users';
import { FiltersModalMyMushroomComponent } from 'src/app/filters/filters-modal-my-mushroom/filters-modal-my-mushroom.component';
import { setApiParams } from '../../../utils/modal-utility-functions';

@Component({
  selector: 'app-my-mushrooms',
  templateUrl: './my-mushrooms.page.html',
  styleUrls: ['./my-mushrooms.page.scss'],
})
export class MyMushroomsPage extends CardList<MushroomWithPic> implements OnInit {
  storageRequestParamKey: string = storageKeys.filterModalMyMushrooms;
  user: User | undefined = undefined;

  ngOnInit() {
    this.initalItemSetting();
  }

  constructor(
    private api: ShroomShareApiService,
    storage: Storage,
    private modalCtrl: ModalController,
    private location: Location
  ) {
    super(storage);
    const user = this.location.getState() as User;
    this.user = user;
    // TODO: handle the case when user is undefined
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FiltersModalMyMushroomComponent,
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

  getItems$(filters: MushroomsFilter): Observable<PaginatedResponse<MushroomWithPic>> {
    filters.userIds = this.user?.id;
    return this.api.getMushrooms$(filters) as Observable<PaginatedResponse<MushroomWithPic>>;
  }

  deleteItem(id: string) {
    this.items = this.items.filter((item) => {
      if (item.id !== id) return item;
      return;
    });
  }

  modifyItem(id: string) { }

  fromModaResponseToApiParams(data: TmpState): MushroomsFilter {
    return setApiParams(data)
  }
}
