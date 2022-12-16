import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { findIndexByProperty, findByProperty } from '../../utils/utility-functions';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/response';
import { ChoosenItem, BaseFilter, CustomMap } from '../../models/standard';

// TODO: fix thhe following bugs
// -> when search is done, sometimes 'favorites' is populated with results from 'items'

const dummyData: ChoosenItem[] = [
  { username: 'John', id: '...', admin: false },
  { username: 'Johnny', id: '...', admin: false },
  { username: 'Eloise', id: '...', admin: false },
];

type ItemPropertyKeys = {
  id: string;
  searchable: string;
};

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
}) // eslint-disable-line
export class PickerComponent implements OnInit {
  /**
   * @description Retrieve items by calling the api
   */
  @Input() getItem!: (option: BaseFilter) => Observable<PaginatedResponse<ChoosenItem>>;
  /**
   * @description Property's keys name:
   * - id: Used by computer to identify the item
   * - searchable: Used by User to identify the item
   */
  @Input() itemKeys!: ItemPropertyKeys;
  /**
   * @description The number of items return by the api at once
   */
  @Input() pageSize?: number = 5;
  /**
   * @description  Allow to filter items by favorite
   */
  @Input() useFavorite?: boolean = false;
  /**
   * @description  Emit an event containing all items selected by the user
   */
  @Output() choosenItem = new EventEmitter<ChoosenItem[]>();

  /**
   * @description todo
   */
  items: ChoosenItem[] = [];
  /**
   * @description todo
   */
  search: string = '';
  /**
   * @description todo
   */
  chips: CustomMap<ChoosenItem> = new CustomMap();
  /**
   * @description todo
   */
  favorites: ChoosenItem[] = [];
  /**
   * @description todo
   */
  allFavorites: ChoosenItem[] = [];
  /**
   * @description todo
   */
  currentPage: number = 1;
  /**
   * @description todo
   */
  lastPage: number = 1;

  constructor() {}

  ngOnInit(): void {
    if (typeof this.getItem !== 'function') throw new Error(`property 'getItem' is not defined.`);
    if (!this.itemKeys) throw new Error(`property 'itemKeys' is not defined.`);
    if (this.itemKeys.id === '') throw new Error(`property 'id' from 'itemKeys' is not defined.`);
    if (this.itemKeys.searchable === '') {
      throw new Error(`property 'searchableValue' from 'itemKeys' is not defined.`);
    }
    if (this.useFavorite) this.setFavorites();
  }

  emitValues() {
    const values = Array.from(this.chips.values());
    this.choosenItem.emit(values);
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
    const searchableKey = this.itemKeys.searchable;
    const option = {
      search: this.search,
      pageSize: this.pageSize,
      currentPage: this.currentPage,
    };
    this.getItem(option).subscribe({
      next: (res) => {
        for (const item of res.items) {
          item.checked = false;
          let favoriteItem;
          if (this.useFavorite) favoriteItem = findByProperty(this.favorites, searchableKey, item);
          if (!favoriteItem) this.items.push(item);
        }
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  private setItems() {
    const searchableKey = this.itemKeys.searchable;
    const option = { search: this.search, pageSize: this.pageSize };
    this.getItem(option).subscribe({
      next: (res) => {
        for (const item of res.items) {
          const chip = this.chips.get(item[searchableKey]);
          item.checked = chip ? true : false;
          let favoriteItem;
          if (this.useFavorite) favoriteItem = findByProperty(this.favorites, searchableKey, item);
          if (!favoriteItem) this.items.push(item);
        }
        this.lastPage = res.lastPage;
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  private resetItems() {
    this.items = [];
    this.currentPage = 1;
  }

  private setFavorites() {
    this.allFavorites = dummyData;
    this.favorites = dummyData;
  }

  onInputChange(e: Event) {
    const event = e as CustomEvent;
    const search: string = event.detail.value;
    const lowerCaseSearch = search.toLowerCase();
    this.search = lowerCaseSearch;
    if (this.useFavorite) this.resetFavorites();
    if (search === '') return this.resetItems();
    this.setItems();

    const filtering = (item: ChoosenItem) => {
      const lowerCaseKey = item[this.itemKeys.searchable].toLowerCase();
      if (lowerCaseKey.startsWith(lowerCaseSearch)) return item;
      return;
    };

    this.items = this.items.filter(filtering);
    if (!this.useFavorite) return;
    this.favorites = this.items.filter(filtering);
  }

  private resetFavorites() {
    const favorites = [...this.allFavorites];
    favorites.forEach((item) => {
      const index = findIndexByProperty(this.favorites, this.itemKeys.searchable, item);
      if (index !== -1) favorites[index] = item;
    });
    this.favorites = favorites;
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const item = event.detail.value;
    const isChecked = event.detail.checked;
    const itemIndex = findIndexByProperty(this.items, this.itemKeys.id, item);
    if (itemIndex !== -1) this.items[itemIndex].checked = isChecked;
    isChecked ? this.chips.set(item, item) : this.chips.delete(item);
    if (!this.useFavorite) return this.emitValues();
    const favoriteIndex = findIndexByProperty(this.favorites, this.itemKeys.searchable, item);
    if (favoriteIndex !== -1) this.favorites[favoriteIndex].checked = isChecked;
    this.emitValues();
  }

  onChipClick(key: string) {
    this.chips.delete(key);
    const itemIndex = findIndexByProperty(this.items, this.itemKeys.searchable, key);
    if (itemIndex !== -1) this.items[itemIndex].checked = false;
    if (!this.useFavorite) return this.emitValues();
    const favoriteIndex = findIndexByProperty(this.favorites, this.itemKeys.searchable, key);
    if (favoriteIndex !== -1) this.favorites[favoriteIndex].checked = false;
    this.emitValues();
  }
}
