import { MushroomWithPic } from "src/app/models/mushrooms";
import * as L from 'leaflet';

export class Marker extends L.Marker {
  mushroom?: MushroomWithPic;
  constructor(latlng: L.LatLngExpression, options: L.MarkerOptions, mushroom?: MushroomWithPic) {
    super(latlng, options);
    if (mushroom) this.mushroom = mushroom;
  }
}
