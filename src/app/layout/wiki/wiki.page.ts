import { Component, OnInit } from '@angular/core';
import { SpeciesFilter, SpecyWithPic } from 'src/app/models/species';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { PaginatedResponse } from 'src/app/models/response';
import { Observable } from 'rxjs';
import { CardList } from '../../cards/cards-list/cards-list';
import { storageKeys } from '../../models/standard';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.page.html',
  styleUrls: ['./wiki.page.scss'],
})
export class WikiPage extends CardList<SpecyWithPic> implements OnInit {
  storageRequestParamKey: string = storageKeys.getSpeciesRequestParams;
  search: string = '';

  ngOnInit() {
    this.initalItemSetting();
  }

  constructor(private api: ShroomShareApiService, storage: Storage) {
    super(storage);
  }

  onInputChange(event: Event) {
    const e = event as CustomEvent;
    const search: string = e.detail.value;
    this.items = [];
    if (search === '') return;
    const filters = { search };
    this.fetchItems(filters);
  }

  getItems$(filters:SpeciesFilter): Observable<PaginatedResponse<SpecyWithPic>> {
    return this.api.getSpecies$(filters) as Observable<PaginatedResponse<SpecyWithPic>>;
  }
}
