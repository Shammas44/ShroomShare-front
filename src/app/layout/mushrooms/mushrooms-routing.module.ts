import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MushroomsPage } from './mushrooms.page';

const routes: Routes = [
  {
    path: '',
    component: MushroomsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MushroomsPageRoutingModule {}
