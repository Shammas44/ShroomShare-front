import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMushroomPage } from './create-mushroom.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMushroomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMushroomPageRoutingModule {}
