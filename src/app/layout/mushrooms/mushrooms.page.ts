import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ShroomShareApiService } from 'src/app/utils/shroom-share-api.service';
import { FiltersModalComponent } from '../../filters/filters-modal/filters-modal.component';
import { TmpState } from '../../models/filters';
import { MushroomsFilter, Mushroom, MushroomWithPic } from '../../models/mushrooms';
import { CustomMap, storageKeys } from '../../models/standard';
import { modalRole } from '../../models/modal';
import { Specy } from '../../models/species';
import { Storage } from '@ionic/storage';
import { concatSinglePropertyOfMap as concat } from 'src/app/utils/utility-functions';
import { PaginatedResponse } from 'src/app/models/response';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-mushrooms',
  templateUrl: './mushrooms.page.html',
  styleUrls: ['./mushrooms.page.scss'],
})
export class MushroomsPage implements OnInit {
  storageRequestParamKey: string = '';
  ngOnInit() {}
  getItems$(filters: MushroomsFilter): Observable<PaginatedResponse<MushroomWithPic>> {
    const defaultFilters = {
      showPictures: true,
      pageSize: 5,
      currentPage: 1,
    } as MushroomsFilter;
    Object.assign(filters, defaultFilters);
    return this.api.getMushrooms$(filters);
  }

  constructor(private api: ShroomShareApiService) {}

  fromModalResponseToApiParams(data: TmpState): MushroomsFilter {
    const params = {} as MushroomsFilter;
    const userIds = concat(data.users?.chips, 'id');
    if (userIds) params.userIds = userIds;
    const speciesIds = concat(data.species?.chips, 'id');
    if (speciesIds) params.specyIds = speciesIds;
    const usages = concat(data.usages, 'name');
    if (usages) params.usages = usages;
    params.radius = data.radius;
    params.from = new Date(data.start).toISOString();
    params.to = new Date(data.end).toISOString();
    return params;
  }
}
