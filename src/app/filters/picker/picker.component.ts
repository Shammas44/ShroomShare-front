import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { UsersMap, ChoosenUser } from '../../models/users';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { findIndexByProperty, findByProperty } from '../../utils/utility-functions';

const dummyData = [
  { username: 'John', id: '...', admin: false },
  { username: 'Johnny', id: '...', admin: false },
  { username: 'Eloise', id: '...', admin: false },
];

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
}) //eslint-disable-line
export class PickerComponent implements OnInit {
  @Input() pageSize = 5;
  @Output() choosenUser = new EventEmitter<ChoosenUser[]>();

  users: ChoosenUser[] = [];
  search: string = '';
  chips: UsersMap = new UsersMap();
  favorites: ChoosenUser[] = [];
  allFavorites: ChoosenUser[] = [];
  currentPage: number = 1;
  lastPage: number = 1;

  constructor(private api: ShroomShareApiService) {
    this.setFavorites();
  }

  emitValues() {
    const values = Array.from(this.chips.values());
    this.choosenUser.emit(values);
  }

  onIonInfinite(event: Event) {
    this.addUsers();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  private addUsers() {
    if (this.currentPage >= this.lastPage) return;
    this.currentPage++;
    const option = {
      search: this.search,
      pageSize: this.pageSize,
      currentPage: this.currentPage,
    };
    this.api.getUsers$(option).subscribe({
      next: (res) => {
        for (const user of res.users as ChoosenUser[]) {
          user.checked = false;
          const favoriteUser = findByProperty(this.favorites, 'username', user);
          if (!favoriteUser) this.users.push(user);
        }
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  private setUsers() {
    const option = { search: this.search, pageSize: this.pageSize };
    this.api.getUsers$(option).subscribe({
      next: (res) => {
        for (const user of res.users as ChoosenUser[]) {
          const chip = this.chips.get(user.username);
          user.checked = chip ? true : false;
          const favoriteUser = findByProperty(this.favorites, 'username', user);
          if (!favoriteUser) this.users.push(user);
        }
        this.lastPage = res.lastPage;
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  private resetUsers() {
    this.users = [];
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
    if (search === '') return this.resetUsers();
    this.setUsers();
    this.users = this.users.filter((user) => {
      const lowerCaseUsername = user.username.toLowerCase();
      if (lowerCaseUsername.startsWith(lowerCaseSearch)) return user;
      return;
    });
    this.favorites = this.favorites.filter((user) => {
      const lowerCaseUsername = user.username.toLowerCase();
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
    const userIndex = findIndexByProperty(this.users, 'username', username);
    const favoriteIndex = findIndexByProperty(this.favorites, 'username', username);
    if (userIndex !== -1) this.users[userIndex].checked = isChecked;
    if (favoriteIndex !== -1) this.favorites[favoriteIndex].checked = isChecked;
    if (isChecked) this.chips.set(username, username);
    if (!isChecked) {
      this.chips.delete(username);
    }
    this.emitValues();
  }

  onChipClick(username: string) {
    this.chips.delete(username);
    const userIndex = findIndexByProperty(this.users, 'username', username);
    const favoriteIndex = findIndexByProperty(this.favorites, 'username', username);
    if (userIndex !== -1) this.users[userIndex].checked = false;
    if (favoriteIndex !== -1) this.favorites[favoriteIndex].checked = false;
    this.emitValues();
  }

  ngOnInit() {}
}
