import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyMushroomsPageRoutingModule } from './my-mushrooms-routing.module';

import { MyMushroomsPage } from './my-mushrooms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyMushroomsPageRoutingModule
  ],
  declarations: [MyMushroomsPage]
})
export class MyMushroomsPageModule {}
