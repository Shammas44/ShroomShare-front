import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { findIndexByProperty, findByProperty } from '../../utils/utility-functions';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../models/response';
import { ChoosenItem } from '../../models/standard';

export class CustomMap<T> extends Map<string, T> {}

const dummyData: ChoosenItem[] = [
  { username: 'John', id: '...', admin: false },
  { username: 'Johnny', id: '...', admin: false },
  { username: 'Eloise', id: '...', admin: false },
];

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
}) // eslint-disable-line
export class PickerComponent implements OnInit {
  @Input() pageSize = 5;
  @Input() getItem!: (option: any) => Observable<PaginatedResponse<ChoosenItem>>;
  @Input() itemKey: string = '';
  @Output() choosenItem = new EventEmitter<ChoosenItem[]>();

  items: ChoosenItem[] = [];
  search: string = '';
  chips: CustomMap<ChoosenItem> = new CustomMap();
  favorites: ChoosenItem[] = [];
  allFavorites: ChoosenItem[] = [];
  currentPage: number = 1;
  lastPage: number = 1;

  constructor() {
    this.setFavorites();
  }

  ngOnInit(): void {
    if (typeof this.getItem !== 'function') throw new Error(`property 'getItem' is not defined.`);
    if (this.itemKey === '') throw new Error(`property 'itemKey' is not defined.`);
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
    const option = {
      search: this.search,
      pageSize: this.pageSize,
      currentPage: this.currentPage,
    };
    this.getItem(option).subscribe({
      next: (res) => {
        for (const item of res.items) {
          item.checked = false;
          const favoriteItem = findByProperty(this.favorites, this.itemKey, item);
          if (!favoriteItem) this.items.push(item);
        }
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  private setItems() {
    const option = { search: this.search, pageSize: this.pageSize };
    this.getItem(option).subscribe({
      next: (res) => {
        for (const item of res.items) {
          const chip = this.chips.get(item[this.itemKey]);
          item.checked = chip ? true : false;
          const favoriteItem = findByProperty(this.favorites, this.itemKey, item);
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
    this.resetFavorites();
    if (search === '') return this.resetItems();
    this.setItems();
    this.items = this.items.filter((item) => {
      const lowerCaseKey = item[this.itemKey].toLowerCase();
      if (lowerCaseKey.startsWith(lowerCaseSearch)) return item;
      return;
    });
    this.favorites = this.favorites.filter((item) => {
      const lowerCaseKey = item[this.itemKey].toLowerCase();
      if (lowerCaseKey.startsWith(lowerCaseSearch)) return item;
      return;
    });
  }

  private resetFavorites() {
    const favorites = [...this.allFavorites];
    favorites.forEach((item) => {
      const index = findIndexByProperty(this.favorites, this.itemKey, item);
      if (index !== -1) favorites[index] = item;
    });
    this.favorites = favorites;
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const key = event.detail.value;
    const isChecked = event.detail.checked;
    const itemIndex = findIndexByProperty(this.items, this.itemKey, key);
    const favoriteIndex = findIndexByProperty(this.favorites, this.itemKey, key);
    if (itemIndex !== -1) this.items[itemIndex].checked = isChecked;
    if (favoriteIndex !== -1) this.favorites[favoriteIndex].checked = isChecked;
    if (isChecked) this.chips.set(key, key);
    if (!isChecked) {
      this.chips.delete(key);
    }
    this.emitValues();
  }

  onChipClick(key: string) {
    this.chips.delete(key);
    const itemIndex = findIndexByProperty(this.items, this.itemKey, key);
    const favoriteIndex = findIndexByProperty(this.favorites, this.itemKey, key);
    if (itemIndex !== -1) this.items[itemIndex].checked = false;
    if (favoriteIndex !== -1) this.favorites[favoriteIndex].checked = false;
    this.emitValues();
  }
}
