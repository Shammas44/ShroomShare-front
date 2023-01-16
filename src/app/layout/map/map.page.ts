import { Component } from '@angular/core';
import { storageKeys } from 'src/app/models/standard';
import { ModalController } from '@ionic/angular';
import { modalRole } from 'src/app/models/modal';
import { PaginatedFilters, TmpState } from 'src/app/models/filters';
import { MushroomsFilter, MushroomWithPic } from 'src/app/models/mushrooms';
import { Storage } from '@ionic/storage';
import { FiltersModalMapComponent } from 'src/app/filters/filters-modal-map/filters-modal-map.component';
import { setApiParams } from '../../utils/modal-utility-functions';
import { MarkerService } from 'src/app/utils/marker.service';
import * as L from 'leaflet';

const position = { lat: 46.7785, lon: 6.6412 };

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  showLoading: boolean = true;
  pickerCityState = { items: [], search: '' };
  storageRequestParamKey: string = storageKeys.getMapRequestParams;
  mushroom: MushroomWithPic | null = null;
  filters: PaginatedFilters = {};
  private map!: L.Map;
  private markerLayer!: L.FeatureGroup;
  private zoom!: number;

  receiveLayer(layer: any) {
    layer as L.FeatureGroup;
    const radius = 30000;
    this.showLoading = false;
    this.markerLayer = layer;
    const options: MushroomsFilter = {
      radius: radius,
      longitude: position.lon,
      latitude: position.lat,
    };
    this.marker.fetchItems(options, this.markerLayer);
    this.marker.setCircle({ lat: position.lat, lon: position.lon }, radius, this.markerLayer);
  }

  receiveMap(map: any) {
    map as L.Map;
    this.map = map;
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
      const params = this.fromModaResponseToApiParams(data);
      this.storage.set(this.storageRequestParamKey, params);
      this.filters = params;
      params.latitude = params?.latitude ?? position.lat;
      params.longitude = params?.longitude ?? position.lon;
      params.radius = params?.radius ?? 1000;
      this.markerLayer.clearLayers();
      this.marker.fetchItems(params, this.markerLayer);
      this.marker.setCircle(
        { lat: params.latitude, lon: params.longitude },
        params.radius,
        this.markerLayer
      );
      this.map.setView([params.latitude, params.longitude]);
      this.mushroom = null;
    }
  }

  fromModaResponseToApiParams(data: TmpState): MushroomsFilter {
    return setApiParams(data);
  }
}
