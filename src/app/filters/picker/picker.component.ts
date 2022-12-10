import { Component, OnInit, Input } from '@angular/core';
import { ShroomShareApiService } from '../../utils/shroom-share-api.service';
import { User } from '../../models/users';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

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

  users: ChoosenUser[];
  search: string;
  chips: UsersMap;
  favorites: ChoosenUser[];
  allFavorites: ChoosenUser[];
  currentPage: number;
  lastPage: number;

  constructor(private api: ShroomShareApiService) {
    this.users = [];
    this.chips = new UsersMap();
    this.allFavorites = [];
    this.favorites = [];
    this.search = '';
    // this.setFavorites();
    this.currentPage = 1;
    this.lastPage = 1;
  }

  onIonInfinite(event: Event) {
    console.log({ event });
    this.addUsers();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
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
        console.log(res);
        for (const user of res.users as ChoosenUser[]) {
          user.checked = false;
          const favoriteUser = this.favorites.find(
            (favorite) => favorite.username === user.username
          );
          if (!favoriteUser) this.users.push(user);
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
    this.api.getUsers$(option).subscribe({
      next: (res) => {
        for (const user of res.users as ChoosenUser[]) {
          const chip = this.chips.get(user.username);
          user.checked = chip ? true : false;
          const favoriteUser = this.favorites.find(
            (favorite) => favorite.username === user.username
          );
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
    this.api
      .getUsers$({
        currentPage: 2,
      })
      .subscribe({
        next: (res) => {
          for (const user of res.users as ChoosenUser[]) {
            user.checked = false;
            this.favorites.push(user);
            this.allFavorites.push(user);
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
    this.resetFavorites();
    if (search === '') {
      console.log('reset');
      this.resetUsers();
      return;
    }
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
      const index = this.favorites.findIndex(
        (favorite) => user.username === favorite.username
      );
      if (index !== -1) favorites[index] = user;
    });
    this.favorites = favorites;
  }

  onCheck(e: Event) {
    const event = e as CustomEvent;
    const username = event.detail.value;
    const isChecked = event.detail.checked;
    const userIndex = this.users.findIndex(
      (user) => user.username === username
    );
    const favoriteIndex = this.favorites.findIndex(
      (user) => user.username === username
    );
    if (userIndex !== -1) this.users[userIndex].checked = isChecked;
    if (favoriteIndex !== -1) this.users[favoriteIndex].checked = isChecked;
    if (isChecked) this.chips.set(username, username);
    if (!isChecked) {
      this.chips.delete(username);
    }
  }

  onChipClick(username: string) {
    this.chips.delete(username);
    const userIndex = this.users.findIndex(
      (user) => user.username === username
    );
    const favoriteIndex = this.favorites.findIndex(
      (favorite) => favorite.username === username
    );
    if (userIndex !== -1) this.users[userIndex].checked = false;
    if (favoriteIndex !== -1) this.users[favoriteIndex].checked = false;
  }

  onSubmit() {
    const usernames = Array.from(this.chips.values());
    console.log(usernames);
  }

  ngOnInit() {}
}
