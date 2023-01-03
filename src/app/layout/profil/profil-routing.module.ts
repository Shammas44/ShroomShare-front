import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilPage } from './profil.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilPage
  },
  {
    path: 'personal-data',
    loadChildren: () => import('./personal-data/personal-data.module').then( m => m.PersonalDataPageModule)
  },
  {
    path: 'my-mushrooms',
    loadChildren: () => import('./my-mushrooms/my-mushrooms.module').then( m => m.MyMushroomsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilPageRoutingModule {}
