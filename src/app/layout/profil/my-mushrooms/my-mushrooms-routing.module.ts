import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyMushroomsPage } from './my-mushrooms.page';

const routes: Routes = [
  {
    path: '',
    component: MyMushroomsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyMushroomsPageRoutingModule {}
