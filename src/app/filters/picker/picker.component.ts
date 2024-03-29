import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonAccordionGroup } from '@ionic/angular';
import { findIndexByProperty, findByProperty } from '../../utils/utility-functions';
import { Observable, map } from 'rxjs';
import { PaginatedResponse } from '../../models/response';
import { ChoosenItem, BaseFilter, CustomMap } from '../../models/standard';
import { PickerState } from '../../models/picker';

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
   * @description Allow to filter items by Users
   */
  @Input() useUsers?: boolean = false;
  /**
   * @description Allow to filter items by favorite
   */
  @Input() useFavorite?: boolean = false;
  /**
   * @description All favorite items list from the user
   */
  @Input() allFavorites?: ChoosenItem[] = [];
  /**
   * @description State of the component
   */
  @Input() state!: PickerState;
  /**
   * @description Emit an event containing all items selected by the user
   */
  @Output() choosenItem = new EventEmitter<PickerState>();

  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

  constructor() {}

  ngOnInit(): void {
    if (typeof this.getItem !== 'function') throw new Error(`property 'getItem' is not defined.`);
    if (!this.itemKeys) throw new Error(`property 'itemKeys' is not defined.`);
    if (this.itemKeys.id === '') throw new Error(`property 'id' from 'itemKeys' is not defined.`);
    if (this.itemKeys.searchable === '') {
      throw new Error(`property 'searchableValue' from 'itemKeys' is not defined.`);
    }
    if (!this.state) {
      const defaultState: PickerState = {
        items: [],
        search: '',
        chips: new CustomMap(),
        favorites: this.allFavorites ? [...this.allFavorites] : [],
        currentPage: 1,
        lastPage: 1,
      };
      this.state = defaultState;
    }
  }

  private addItems(): Observable<ChoosenItem[]> | undefined {
    if (this.state.currentPage >= this.state.lastPage) return;
    this.state.currentPage++;
    const searchableKey = this.itemKeys.searchable;
    const option = {
      search: this.state.search,
      pageSize: this.pageSize,
      currentPage: this.state.currentPage,
    };
    return this.getItem(option).pipe(
      map((res) => res.items),
      map((items) => {
        const filteredValues = [];
        items.forEach((item) => {
          item.checked = false;
          let favoriteItem;
          if (this.useFavorite)
            favoriteItem = findByProperty(this.state.favorites, searchableKey, item);
          if (!favoriteItem) filteredValues.push(item);
        });
        return items;
      })
    );
  }

  private setItems(callback?: Function) {
    const searchableKey = this.itemKeys.searchable;
    const option = { search: this.state.search, pageSize: this.pageSize };
    this.getItem(option).subscribe({
      next: (res) => {
        for (const item of res.items) {
          const chip = this.state.chips.get(item[searchableKey]);
          item.checked = chip ? true : false;
          let favoriteItem;
          if (this.useFavorite) {
            favoriteItem = findByProperty(this.state.favorites, searchableKey, item);
          }
          if (!favoriteItem) this.state.items.push(item);
        }
        this.state.lastPage = res.lastPage;
        if (callback) callback();
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  private resetItems() {
    this.state.items = [];
    this.state.currentPage = 1;
  }

  private resetFavorites() {
    if (!this.allFavorites) return;
    const favorites = [...this.allFavorites];
    favorites.forEach((item) => {
      const index = findIndexByProperty(this.state.favorites, this.itemKeys.searchable, item);
      if (index !== -1) favorites[index] = item;
    });
    this.state.favorites = favorites;
  }

  emitValues() {
    this.choosenItem.emit(this.state);
  }

  onInputChange(e: Event) {
    const accordionValues: string[] = [];
    const event = e as CustomEvent;
    const search: string = event.detail.value;
    const lowerCaseSearch = search.toLowerCase();
    this.state.search = lowerCaseSearch;
    if (this.useFavorite) this.resetFavorites();
    this.resetItems();
    if (search === '') {
      if (this.accordionGroup) this.accordionGroup.value = [];
      return;
    }

    const callback = () => {
      const filtering = (item: ChoosenItem) => {
        const lowerCaseKey = item[this.itemKeys.searchable].toLowerCase();
        if (lowerCaseKey.startsWith(lowerCaseSearch)) return item;
        return;
      };

      this.state.items = this.state.items.filter(filtering);
      if (this.state.items.length > 0) accordionValues.push('second');
      if (!this.useFavorite) {
        this.accordionGroup.value = accordionValues;
        return;
      }
      this.state.favorites = this.state.favorites.filter(filtering);
      if (this.state.favorites.length > 0) accordionValues.push('first');
      this.accordionGroup.value = accordionValues;
    };
    this.setItems(callback);
  }

  onCheck(e: Event) {
    const searchableKey = this.itemKeys.searchable;
    const event = e as CustomEvent;
    const item = event.detail.value;
    const isChecked = event.detail.checked;
    const itemIndex = findIndexByProperty(this.state.items, this.itemKeys.id, item);
    if (itemIndex !== -1) this.state.items[itemIndex].checked = isChecked;
    isChecked
      ? this.state.chips.set(item[searchableKey], item)
      : this.state.chips.delete(item[searchableKey]);
    if (!this.useFavorite) return this.emitValues();
    const favoriteIndex = findIndexByProperty(this.state.favorites, this.itemKeys.searchable, item);
    if (favoriteIndex !== -1) this.state.favorites[favoriteIndex].checked = isChecked;
    this.emitValues();
  }

  onChipClick(key: string) {
    this.state.chips.delete(key);
    const itemIndex = findIndexByProperty(this.state.items, this.itemKeys.searchable, key);
    if (itemIndex !== -1) this.state.items[itemIndex].checked = false;
    if (!this.useFavorite) return this.emitValues();
    const favoriteIndex = findIndexByProperty(this.state.favorites, this.itemKeys.searchable, key);
    if (favoriteIndex !== -1) this.state.favorites[favoriteIndex].checked = false;
    this.emitValues();
  }

  onIonInfinite(event: Event) {
    this.addItems()?.subscribe({
      next: (items) => {
        items.forEach((item) => this.state.items.push(item));
        setTimeout(() => {
          (event as InfiniteScrollCustomEvent).target.complete();
        }, 500);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
