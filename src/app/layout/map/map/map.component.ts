import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import * as L from 'leaflet';
import { Marker } from '../Marker';

const position = { lat: 46.7785, long: 6.6412 };

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  @Output() map$: EventEmitter<L.Map> = new EventEmitter<L.Map>();
  @Output() zoom$: EventEmitter<number> = new EventEmitter<number>();
  @Input() options: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        opacity: 0.7,
        maxZoom: 19,
        detectRetina: true,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    ],
    zoom: 18,
    center: L.latLng(position.lat, position.long),
  };

  public map!: L.Map;
  public zoom: number = 18;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.map.clearAllEventListeners;
    this.map.remove();
  }

  onMapReady(map: L.Map) {
    console.log('ready');
    setTimeout(() => {
      map.invalidateSize();
      this.map = map;
      this.map$.emit(map);
      this.zoom = map.getZoom();
      this.zoom$.emit(this.zoom);
    }, 0);
  }

  onMapZoomEnd(e: L.LeafletEvent) {
    e as L.ZoomAnimEvent;
    this.zoom = e.target.getZoom();
    this.zoom$.emit(this.zoom);
  }
}
