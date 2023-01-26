import { Component } from '@angular/core';

// Custom type that represent a tab data.
declare type PageTab = {
  title: string; // The title of the tab in the tab bar
  icon: string; // The icon of the tab in the tab bar
  path: string; // The route's path of the tab to display
  class?: string;
};

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.page.html',
  styleUrls: ['layout.page.scss'],
})
export class LayoutPage {
  tabs: PageTab[];
  secondaryTabs: PageTab[];

  constructor() {
    this.tabs = [
      { title: 'Wiki', icon: 'assets/icon/globe.svg', path: 'wiki' },
      { title: 'Mushrooms', icon: 'assets/icon/mushroom.svg', path: 'mushrooms' },
      { title: 'Camera', icon: 'assets/icon/camera.svg', path: 'camera' },
      { title: 'Map', icon: 'assets/icon/map.svg', path: 'map' },
    ];
    this.secondaryTabs = [
      { title: 'favorites', icon: 'heart', path: 'favorites', class: 'button--custom' },
      { title: 'chat', icon: 'chatbox-ellipses', path: 'chat', class: 'button--custom' },
      { title: 'profil', icon: 'person-circle-outline', path: 'profil', class: 'button--custom' },
    ];
  }

  changeColor(index: number) {
    this.secondaryTabs.forEach((tab, i) => {
      tab.class = index === i ? 'button--custom selected' : 'button--custom';
    });
  }

  unsetColor() {
    this.secondaryTabs.forEach((tab) => {
      tab.class = 'button--custom';
    });
  }
}
