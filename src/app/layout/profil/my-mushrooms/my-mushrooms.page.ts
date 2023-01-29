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
import { IonModal } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core/components';
import { ModifyMushroomModalComponent } from './../../../modify-mushroom-modal/modify-mushroom-modal.component';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { MushroomPicture } from 'src/app/models/mushrooms';

@Component({
  selector: 'app-my-mushrooms',
  templateUrl: './my-mushrooms.page.html',
  styleUrls: ['./my-mushrooms.page.scss'],
})
export class MyMushroomsPage extends CardList<MushroomWithPic> implements OnInit {
  storageRequestParamKey: string = storageKeys.filterModalMyMushrooms;
  user: User | undefined = undefined;
  mushroom: MushroomWithPic;
  mushroomModif: boolean = false;

  ngOnInit() {
    this.initalItemSetting();
  }

  modifymushroom: boolean = false;

  constructor(
    private api: ShroomShareApiService,
    storage: Storage,
    private modalCtrl: ModalController,
    private location: Location,
    private route: Router
  ) {
    super(storage);
    const user = this.location.getState() as User;
    this.user = user;
    if (this.user === undefined) this.route.navigate(['/profil']);
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

  async modifyItem(currentmushroom: MushroomWithPic) {
    const modalModify = await this.modalCtrl.create({
      component: ModifyMushroomModalComponent,
      componentProps: {
        mushroom: currentmushroom,
      },
    });
    await modalModify.present();
    const { data, role } = await modalModify.onWillDismiss();
    if (role == 'cancel') {
      const filter = { userIds: currentmushroom.user.id };

      this.api.getMushrooms$(filter).subscribe((res) => {
        let totalMushrooms = res.lastPage * res.items.length;
        const filter2 = {
          userIds: currentmushroom.user.id,
          pageSize: totalMushrooms,
          showPictures: true,
        };
        this.api.getMushrooms$(filter2).subscribe((res) => {
          res.items.forEach((element) => {
            this.items.forEach((item) => {
              if (item.id === element.id) {
                item.description = element.description;
                item.picture = element.picture as any;
                item.specy = element.specy;
              }
            });
          });
        });
      });
    }
  }

  fromModaResponseToApiParams(data: TmpState): MushroomsFilter {
    return setApiParams(data);
  }
}
