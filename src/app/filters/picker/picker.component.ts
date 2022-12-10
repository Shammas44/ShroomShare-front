import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { User } from '../../models/users';
import { Observable, from } from 'rxjs';

type ChoosenUser = User & {
  checked?: boolean;
};
class UsersMap extends Map<string, ChoosenUser> {}

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
})
export class PickerComponent implements OnInit {
  @Input() pageSize = 5;

  users: UsersMap;
  search: string;
  chips: UsersMap;
  favorites: UsersMap;
  allFavorites: UsersMap;
  currentPage: number;
  lastPage: number;

  constructor(private api: ShroomShareApiService) {
    this.users = new UsersMap();
    this.chips = new UsersMap();
    this.allFavorites = new UsersMap();
    this.favorites = new UsersMap();
    this.search = '';
    this.setFavorites();
    this.currentPage = 1;
    this.lastPage = 1;
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const element = event.target as HTMLDetailsElement;
    if (element === null) return;
    if (
      //detect scroll to bottom
      element.offsetHeight + element.scrollTop >=
      element.scrollHeight - 1
    ) {
      console.log(event);
      this.addUsers();
    }
  }

  private addUsers() {
    if (this.currentPage >= this.lastPage) return;
    this.currentPage++;
    let option = {
      search: this.search,
      pageSize: this.pageSize,
      currentPage: this.currentPage,
    };
    this.api.getUsers$(option).subscribe({
      next: (res) => {
        for (const user of res.users as ChoosenUser[]) {
          user.checked = false;
          const favoriteUser = this.favorites.get(user.username);
          if (!favoriteUser) this.users.set(user.username, user);
        }
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  private setUsers() {
    let option = { search: this.search, pageSize: this.pageSize };
    console.log({ search: this.search });
    if (this.search === '') {
      this.resetFavorites();
      this.users = new Map();
      this.currentPage = 1;
      return;
    }
    this.api.getUsers$(option).subscribe({
      next: (res) => {
        for (const user of res.users as ChoosenUser[]) {
          const chip = this.chips.get(user.username);
          user.checked = chip ? true : false;
          const favoriteUser = this.favorites.get(user.username);
          if (!favoriteUser) this.users.set(user.username, user);
        }
        this.lastPage = res.lastPage;
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  private setFavorites() {
    this.api
      .getUsers$({
        currentPage: 2,
      })
      .subscribe({
        next: (res) => {
          for (const user of res.users as ChoosenUser[]) {
            user.checked = false;
            this.favorites.set(user.username, user);
            this.allFavorites.set(user.username, user);
          }
        },
        error: (err) => {
          console.log({ err });
        },
      });
  }

  onInputChange(e: Event) {
    const event = e as CustomEvent;
    const search: string = event.detail.value;
    const lowerCaseSearch = search.toLowerCase();
    this.search = lowerCaseSearch;
    this.setUsers();
    this.resetFavorites();
    if (search === '') return;
    this.users.forEach((user) => {
      const lowerCaseUsername = user.username.toLowerCase();
      if (!lowerCaseUsername.startsWith(lowerCaseSearch))
        this.users.delete(user.username);
    });
    this.favorites.forEach((user) => {
      const lowerCaseUsername = user.username.toLowerCase();
      if (!lowerCaseUsername.startsWith(lowerCaseSearch))
        this.favorites.delete(user.username);
    });
  }

  private resetFavorites() {
    const map = new UsersMap(this.allFavorites);
    map.forEach((user) => {
      const existingUser = this.favorites.get(user.username);
      if (existingUser) map.set(user.username, existingUser);
    });
    this.favorites = map;
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const username = event.detail.value;
    const isChecked = event.detail.checked;
    const user = this.users.get(username);
    const favoriteUser = this.favorites.get(username);
    if (user) {
      user.checked = isChecked;
      this.users.set(username, user);
    }
    if (favoriteUser) {
      favoriteUser.checked = isChecked;
      this.favorites.set(username, favoriteUser);
    }
    if (isChecked) this.chips.set(username, username);
    if (!isChecked) {
      this.chips.delete(username);
    }
  }

  onChipClick(username: string) {
    this.chips.delete(username);
    const user = this.users.get(username);
    const favoriteUser = this.favorites.get(username);
    if (user) {
      user.checked = false;
      this.users.set(username, user);
    }
    if (favoriteUser) {
      favoriteUser.checked = false;
      this.favorites.set(username, favoriteUser);
    }
  }

  onSubmit() {
    const usernames = Array.from(this.chips.values());
    console.log(usernames);
  }

  ngOnInit() {}
}
