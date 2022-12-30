import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

// Custom type that represent a tab data.
declare type PageTab = {
  title: string; // The title of the tab in the tab bar
  icon: string; // The icon of the tab in the tab bar
  path: string; // The route's path of the tab to display
};

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.page.html',
  styleUrls: ['layout.page.scss'],
})// eslint-disable-line
export class LayoutPage {
  tabs: PageTab[];

  constructor(private auth: AuthService, private router: Router) {
    this.tabs = [
      { title: 'Map', icon: 'add', path: 'map' },
      { title: 'Wiki', icon: 'map', path: 'wiki' },
      { title: 'Mushrooms', icon: 'list', path: 'mushrooms' },
      { title: 'Camera', icon: 'list', path: 'camera' },
    ];
  }

  logOut() {
    this.auth.logOut();
    this.router.navigateByUrl('/login');
  }
}
