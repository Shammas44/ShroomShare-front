import { Component, OnInit } from '@angular/core';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { TmpState } from '../../../models/filters';
import { MushroomsFilter, MushroomWithPic } from '../../../models/mushrooms';
import { concatSinglePropertyOfMap as concat } from '../../../utils/utility-functions';
import { PaginatedResponse } from 'src/app/models/response';
import { Observable } from 'rxjs';
import { CardList } from '../../../cards/cards-list/cards-list';
import { storageKeys } from '../../../models/standard';
import { ModalController } from '@ionic/angular';
import { Usage } from '../../../models/usages';
import { FiltersModalComponent } from '../../../filters/filters-modal/filters-modal.component';
import { modalRole } from '../../../models/modal';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import { User } from 'src/app/models/users';

@Component({
  selector: 'app-my-mushrooms',
  templateUrl: './my-mushrooms.page.html',
  styleUrls: ['./my-mushrooms.page.scss'],
})
export class MyMushroomsPage extends CardList<MushroomWithPic> implements OnInit {
  storageRequestParamKey: string = storageKeys.filterModalMyMushrooms;
  user: User | undefined = undefined

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

  getItems$(filters: MushroomsFilter): Observable<PaginatedResponse<MushroomWithPic>> {
    filters.userIds = this.user?.id;
    return this.api.getMushrooms$(filters) as Observable<PaginatedResponse<MushroomWithPic>>;
  }

  fromModaResponseToApiParams(data: TmpState): MushroomsFilter {
    const params = {} as MushroomsFilter;
    const userIds = concat(data.users?.chips, 'id');
    if (userIds) params.userIds = userIds;
    const speciesIds = concat(data.species?.chips, 'id');
    if (speciesIds) params.specyIds = speciesIds;
    const usages = Array.from(data.usages?.values() || []).filter((value) => {
      if (value.checked === true) return value;
      return;
    });
    if (usages.length === 1) params.usage = usages[0].value as Usage;
    params.radius = data.radius;
    params.from = new Date(data.start).toISOString();
    params.to = new Date(data.end).toISOString();
    return params;
  }
}
