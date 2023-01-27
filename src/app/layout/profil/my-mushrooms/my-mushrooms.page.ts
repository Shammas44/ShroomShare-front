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
import { Modal } from 'src/app/filters/modal';
import { ModifyMushroomModalComponent } from './../../../modify-mushroom-modal/modify-mushroom-modal.component';
import { Mushroom } from 'src/app/models/mushrooms';

@Component({
  selector: 'app-my-mushrooms',
  templateUrl: './my-mushrooms.page.html',
  styleUrls: ['./my-mushrooms.page.scss'],
})
export class MyMushroomsPage extends CardList<MushroomWithPic> implements OnInit {
  storageRequestParamKey: string = storageKeys.filterModalMyMushrooms;
  user: User | undefined = undefined;
  mushroom: MushroomWithPic;
  test = 'OUI';
  master = 'Master';

  ngOnInit() {
    this.initalItemSetting();
  }

  modifymushroom: boolean = false;
  currentMushroom: any = {
    id: 'Bonjour',
    test2: 'test',
  };

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

  async Modal2() {
    const mondal = await this.modalCtrl.create({
      component: Modal,
    });
    this.modal.present();
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
  @ViewChild(IonModal) modal: IonModal;

  message = ``;
  name: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  async modifyItem(id: string, currentmushroom: MushroomWithPic) {
    const modalModify = await this.modalCtrl.create({
      component: ModifyMushroomModalComponent,
      componentProps: {
        mushroom: currentmushroom,
      },
    });

    console.log(modalModify);
    await modalModify.present();
    // await modalModify.dismiss();
    // this.modifymushroom = true;
    // this.currentMushroom = mushroom;
    // console.log(mushroom);
    // this.modal.present;

    // console.log('bonjour');
  }

  fromModaResponseToApiParams(data: TmpState): MushroomsFilter {
    return setApiParams(data);
  }
}
