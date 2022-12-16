import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { findIndexByProperty, findByProperty } from '../../utils/utility-functions';
// import { ChoosenUser } from '../../models/users';
// import { ChoosenItem } from '../../models/standard';

export type User = {
  id: string;
  username: string;
  admin: boolean;
};

export type ChoosenUser = ChoosenItem & User;

export type KeyString = {
  [key: string]: any;
};

export type Primitive = string | number | boolean;

export type ChoosenItem = KeyString & {
  checked?: boolean;
};

export class CustomMap<T> extends Map<string, T> {}

function getItem(option) {
  // if (this.currentPage >= this.lastPage) return;
  // this.currentPage++;
  // const option = {
  //   search: this.search,
  //   pageSize: this.pageSize,
  //   currentPage: this.currentPage,
  // };
  // this.api.getUsers$(option).subscribe({
  //   next: (res) => {
  //     for (const user of res.users as unknown as ChoosenItem[]) {
  //       user.checked = false;
  //       const favoriteUser = findByProperty(this.favorites, 'username', user);
  //       if (!favoriteUser) this.items.push(user);
  //     }
  //   },
  //   error: (err) => {
  //     console.log({ err });
  // });
  //   },
}

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
}) //eslint-disable-line
export abstract class PickerComponent {
  @Input() pageSize = 5;
  @input() getItem: Function;
  @Output() choosenItem = new EventEmitter<ChoosenItem[]>();

  items: ChoosenItem[] = [];
  search: string = '';
  chips: CustomMap<ChoosenItem> = new CustomMap();
  favorites: ChoosenItem[] = [];
  allFavorites: ChoosenItem[] = [];
  currentPage: number = 1;
  lastPage: number = 1;

  constructor(private api: ShroomShareApiService) {
    this.setFavorites();
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
    this.api.getUsers$(option).subscribe({
      next: (res) => {
        for (const user of res.users as unknown as ChoosenItem[]) {
          user.checked = false;
          const favoriteUser = findByProperty(this.favorites, 'username', user);
          if (!favoriteUser) this.items.push(user);
        }
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  private setItems() {
    const option = { search: this.search, pageSize: this.pageSize };
    this.api.getUsers$(option).subscribe({
      next: (res) => {
        for (const user of res.users as unknown as ChoosenItem[]) {
          const chip = this.chips.get(user['username']);
          user.checked = chip ? true : false;
          const favoriteUser = findByProperty(this.favorites, 'username', user);
          if (!favoriteUser) this.items.push(user);
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
    const dummyData: ChoosenItem[] = [
      { username: 'John', id: '...', admin: false },
      { username: 'Johnny', id: '...', admin: false },
      { username: 'Eloise', id: '...', admin: false },
    ];
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
    this.items = this.items.filter((user) => {
      const lowerCaseUsername = user['username'].toLowerCase();
      if (lowerCaseUsername.startsWith(lowerCaseSearch)) return user;
      return;
    });
    this.favorites = this.favorites.filter((user) => {
      const lowerCaseUsername = user['username'].toLowerCase();
      if (lowerCaseUsername.startsWith(lowerCaseSearch)) return user;
      return;
    });
  }

  private resetFavorites() {
    const favorites = [...this.allFavorites];
    favorites.forEach((user) => {
      const index = findIndexByProperty(this.favorites, 'username', user);
      if (index !== -1) favorites[index] = user;
    });
    this.favorites = favorites;
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const username = event.detail.value;
    const isChecked = event.detail.checked;
    const userIndex = findIndexByProperty(this.items, 'username', username);
    const favoriteIndex = findIndexByProperty(this.favorites, 'username', username);
    if (userIndex !== -1) this.items[userIndex].checked = isChecked;
    if (favoriteIndex !== -1) this.favorites[favoriteIndex].checked = isChecked;
    if (isChecked) this.chips.set(username, username);
    if (!isChecked) {
      this.chips.delete(username);
    }
    this.emitValues();
  }

  onChipClick(username: string) {
    this.chips.delete(username);
    const userIndex = findIndexByProperty(this.items, 'username', username);
    const favoriteIndex = findIndexByProperty(this.favorites, 'username', username);
    if (userIndex !== -1) this.items[userIndex].checked = false;
    if (favoriteIndex !== -1) this.favorites[favoriteIndex].checked = false;
    this.emitValues();
  }
}
