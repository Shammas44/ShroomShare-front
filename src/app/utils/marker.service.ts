import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Marker } from '../layout/map/Marker';
import { ShroomShareApiService } from './shroom-share-api.service';
import { MushroomsFilter, MushroomWithPic } from '../models/mushrooms';
import { PaginatedResponse } from '../models/response';
import { Observable } from 'rxjs';
import { defaultIcon } from '../layout/map/default-marker';
import { Coordinates } from '../models/picker';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private api: ShroomShareApiService) {}

  getItems$(filters: MushroomsFilter): Observable<PaginatedResponse<MushroomWithPic>> {
    return this.api.getMushrooms$(filters) as Observable<PaginatedResponse<MushroomWithPic>>;
  }

  setCircle(position: Coordinates, radius: number, map: L.Map) {
    const color = '#512A18';
    L.circleMarker([position.lat, position.lon], { radius, fillColor: color, color }).addTo(map);
  }

  fetchItems(params: MushroomsFilter, map: L.Map) {
    const defaultParams = {
      showPictures: true,
      currentPage: 1,
      pageSize: 1000,
    };
    const options = Object.assign(params, defaultParams);
    this.getItems$(options).subscribe({
      next: (res: PaginatedResponse<MushroomWithPic>) => {
        for (const item of res.items) {
          const marker = new Marker(
            [item.location.coordinates[1], item.location.coordinates[0]],
            { icon: defaultIcon },
            item
          );
          console.log({ marker, map });
          marker.addTo(map);
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
