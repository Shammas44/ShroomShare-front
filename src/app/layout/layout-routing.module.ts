import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPage } from './layout.page';

const routes: Routes = [
  {
    path: '',
    component: LayoutPage,
    children: [
      {
        path: 'map',
        loadChildren: () => import('./map/map.module').then((m) => m.MapPageModule),
      },
      {
        path: 'camera',
        loadChildren: () => import('./camera/camera.module').then((m) => m.CameraPageModule),
      },
      {
        path: 'wiki',
        loadChildren: () => import('./wiki/wiki.module').then((m) => m.WikiPageModule),
      },
      {
        path: 'mushrooms',
        loadChildren: () =>
          import('./mushrooms/mushrooms.module').then((m) => m.MushroomsPageModule),
      },
      {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then((m) => m.MessagePageModule),
      },
      {
        path: 'favorites',
        loadChildren: () =>
          import('./favorites/favorites.module').then((m) => m.FavoritesPageModule),
      },
      {
        path: 'profil',
        loadChildren: () => import('./profil/profil.module').then((m) => m.ProfilPageModule),
      },
      {
        path: '',
        redirectTo: 'map', // Or whatever tabs is your default one
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then((m) => m.FavoritesPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutPageRoutingModule {}
