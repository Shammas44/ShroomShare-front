import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { PaginatedFilters } from '../../models/filters';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/models/response';
import { Storage } from '@ionic/storage';

export abstract class CardList<Item> {
  abstract getItems$(filters: PaginatedFilters): Observable<PaginatedResponse<Item>>;
  abstract storageRequestParamKey: string;
  items: Item[] = [];
  currentPage: number = 1;
  lastPage: number = 2;
  pageSize: number = 5;
  filters: PaginatedFilters = {};

  constructor(protected storage: Storage) {}

  protected initalItemSetting() {
    this.storage
      .get(this.storageRequestParamKey)
      .then((filters) => {
        filters ? this.fetchItems(filters) : this.fetchItems({});
      })
      .catch(() => {
        this.fetchItems({});
      });
  }

  onIonInfinite(event: Event) {
    this.addItems();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  private addItems() {
    if (this.currentPage >= this.lastPage) return;
    this.currentPage++;
    this.fetchItems(this.filters);
  }

  protected fetchItems(params: PaginatedFilters) {
    const defaultParams = {
      showPictures: true,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    };
    const options = Object.assign(params, defaultParams);
    this.getItems$(options).subscribe({
      next: (res) => {
        console.log({ res });
        this.lastPage = res.lastPage;
        for (const item of res.items as Item[]) {
          this.items.push(item);
        }
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }
}
