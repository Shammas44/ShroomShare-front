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
import { Geolocation, Position } from '@capacitor/geolocation';
import { Usage } from 'src/app/models/usages';

const position = { lat: 46.7785, lon: 6.6412 };

export type MapMushroomsFilter = PaginatedFilters & {
  latitude: number;
  longitude: number;
  specyIds?: string;
  userIds?: string;
  showPictures?: boolean;
  usage?: Usage;
  from?: string;
  to?: string;
  radius: number;
  usages?: string;
};

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
  filters: MapMushroomsFilter | null = null;
  positionWatcherId!: string;
  private map!: L.Map;
  private markerLayer!: L.FeatureGroup;
  private zoom!: number;

  ionViewDidEnter() {
    const option: PositionOptions = {};
    const callback = (position: Position | null) => {
      const coordinates = position
        ? {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
        : null;
      if (coordinates) this.marker.setUserPosition(coordinates);
    };
    Geolocation.watchPosition(option, callback).then((id) => {
      this.positionWatcherId = id;
    });
  }

  ionViewDidLeave() {
    Geolocation.clearWatch({ id: this.positionWatcherId });
  }

  receiveMap(map: any) {
    map.map as L.Map;
    map.layer as L.FeatureGroup;
    this.map = map.map;

    this.showLoading = false;
    this.markerLayer = map.layer;

    const updateMap = (options: MapMushroomsFilter) => {
      const coordinates = { lat: options.latitude, lon: options.longitude };
      this.marker.fetchItems(options, this.markerLayer);
      this.marker.setCircle(coordinates, options.radius, this.markerLayer);
      this.marker.setUser(coordinates, this.markerLayer);
      this.map.setView([coordinates.lat, coordinates.lon]);
    };

    this.storage
      .get(storageKeys.getMapRequestParams)
      .then((res) => {
        this.filters = res;
        if (this.filters === null) throw Error();
        updateMap(this.filters);
      })
      .catch(() => {
        const options: MapMushroomsFilter = {
          radius: 30000,
          longitude: position.lon,
          latitude: position.lat,
        };
        updateMap(options);
      });
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
      const params = this.fromModaResponseToApiParams(data) as MapMushroomsFilter;
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
