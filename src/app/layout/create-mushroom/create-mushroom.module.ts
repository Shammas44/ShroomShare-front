import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMushroomPageRoutingModule } from './create-mushroom-routing.module';

import { CreateMushroomPage } from './create-mushroom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMushroomPageRoutingModule
  ],
  declarations: [CreateMushroomPage]
})
export class CreateMushroomPageModule {}
