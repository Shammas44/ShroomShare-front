import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MushroomsPageRoutingModule } from './mushrooms-routing.module';

import { MushroomsPage } from './mushrooms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MushroomsPageRoutingModule
  ],
  declarations: [MushroomsPage]
})
export class MushroomsPageModule {}
