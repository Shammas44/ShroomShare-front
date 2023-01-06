import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalDataPage } from './personal-data/personal-data.page';
import { ProfilPage } from './profil.page';
import { MyMushroomsPage } from './my-mushrooms/my-mushrooms.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilPage,
  },
  {
    path: 'personal-data',
    component: PersonalDataPage,
  },
  {
    path: 'my-mushrooms',
    component: MyMushroomsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilPageRoutingModule {}
