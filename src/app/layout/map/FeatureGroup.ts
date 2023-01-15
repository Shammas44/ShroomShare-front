import * as L from 'leaflet';
import { MushroomWithPic } from 'src/app/models/mushrooms';

export class FeatureGroup extends L.FeatureGroup {
  mushroom: MushroomWithPic | null;
  constructor(mushroom: MushroomWithPic | null, layers?: L.Layer[], options?: L.LayerOptions) {
    super(layers, options);
    this.mushroom = mushroom;
  }

  clear() {
    this.mushroom = null;
    super.clearLayers();
  }
}
