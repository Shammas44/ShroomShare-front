import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { PaginatedFilters } from '../../models/filters';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/models/response';
import { Storage } from '@ionic/storage';

const MSG = {
  defaultLoading: 'Chargement',
  noMoreResults: 'Plus aucuns résultats',
};

export abstract class CardList<Item> {
  abstract getItems$(filters: PaginatedFilters): Observable<PaginatedResponse<Item>>;
  abstract storageRequestParamKey: string;
  items: Item[] = [];
  currentPage: number = 1;
  lastPage: number = 2;
  pageSize: number = 5;
  filters: PaginatedFilters = {};
  loadingMessage: string = MSG.defaultLoading;

  constructor(protected storage: Storage) {}

  protected initalItemSetting() {
    this.storage
      .get(this.storageRequestParamKey)
      .then((filters) => {
        filters
          ? this.fetchItems(filters)?.subscribe(this.getSubscriber())
          : this.fetchItems({})?.subscribe(this.getSubscriber());
      })
      .catch(() => {
        console.log('cannot fetchItems!');
      });
  }

  onIonInfinite(event: Event) {
    const callback = function () {
      setTimeout(() => {
        (event as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    };
    this.fetchItems(this.filters)?.subscribe(this.getSubscriber(callback)) ?? callback();
  }

  protected getSubscriber(callback?: Function) {
    return {
      next: (res: PaginatedResponse<Item>) => {
        console.log({ res });
        this.lastPage = res.lastPage;
        for (const item of res.items as Item[]) {
          this.items.push(item);
        }
        if (callback) callback();
      },
      error: (err: any) => {
        console.log({ err });
      },
    };
  }

  protected fetchItems(params: PaginatedFilters): Observable<PaginatedResponse<Item>> | undefined {
    if (this.currentPage > this.lastPage) {
      this.loadingMessage = MSG.noMoreResults;
      return;
    }
    this.loadingMessage = MSG.defaultLoading;
    const defaultParams = {
      showPictures: true,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    };
    const options = Object.assign(params, defaultParams);
    this.currentPage++;
    return this.getItems$(options);
  }
}
