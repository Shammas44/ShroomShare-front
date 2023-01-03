import { Component } from '@angular/core';

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
})
export class LayoutPage {
  tabs: PageTab[];
  secondaryTabs: PageTab[]

  constructor() {
    this.tabs = [
      { title: 'Map', icon: 'earth', path: 'map' },
      { title: 'Wiki', icon: 'book', path: 'wiki' },
      { title: 'Mushrooms', icon: 'list', path: 'mushrooms' },
      { title: 'Camera', icon: 'camera', path: 'camera' },
    ];
    this.secondaryTabs = [
      { title: 'favorites', icon: 'heart', path: 'favorites' },
      { title: 'chat', icon: 'chatbox-ellipses', path: 'chat' },
      { title: 'profil', icon: 'person-circle-outline', path: 'profil' },
    ]
  }
}
