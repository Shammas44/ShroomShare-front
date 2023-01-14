import { Component } from '@angular/core';
import { storageKeys } from 'src/app/models/standard';
import { ModalController } from '@ionic/angular';
import { modalRole } from 'src/app/models/modal';
import { PaginatedFilters, TmpState } from 'src/app/models/filters';
import { MushroomsFilter } from 'src/app/models/mushrooms';
import { Storage } from '@ionic/storage';
import { FiltersModalMapComponent } from 'src/app/filters/filters-modal-map/filters-modal-map.component';
import { setApiParams } from '../../utils/modal-utility-functions';
import { Marker } from './Marker';
import { MarkerService } from 'src/app/utils/marker.service';
import * as L from 'leaflet';

const position = { lat: 46.7785, long: 6.6412 };

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  showLoading: boolean = true;
  pickerCityState = { items: [], search: '' };
  storageRequestParamKey: string = storageKeys.getMapRequestParams;
  markers: Marker[] = [];
  filters: PaginatedFilters = {};
  private map!: L.Map;
  private zoom!: number;

  receiveMap(map: any) {
    map as L.Map;
    const radius = 100000;
    console.log('Map received');
    this.showLoading = false;
    this.map = map as L.Map;
    const options: MushroomsFilter = {
      radius: radius,
      longitude: position.long,
      latitude: position.lat,
    };
    this.marker.fetchItems(options, this.map);
    this.marker.setCircle({ lat: position.lat, lon: position.long }, radius / 1000, this.map);
  }

  receiveZoom(zoom: any) {
    this.zoom = zoom as number;
  }

  constructor(
    private storage: Storage,
    private modalCtrl: ModalController,
    private marker: MarkerService
  ) {}

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FiltersModalMapComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === modalRole.confirm) {
      console.log({ data });
      const params = this.fromModaResponseToApiParams(data);
      this.markers = [];
      this.storage.set(this.storageRequestParamKey, params);
      this.filters = params;
      this.marker.fetchItems(params, this.map);
    }
  }

  fromModaResponseToApiParams(data: TmpState): MushroomsFilter {
    return setApiParams(data);
  }
}
