import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyMushroomsPageRoutingModule } from './my-mushrooms-routing.module';
import { MyMushroomsPage } from './my-mushrooms.page';
import { CardModule } from '../../../cards/cards.module';
import { ModifyMushroomModalComponent } from './../../../modify-mushroom-modal/modify-mushroom-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MyMushroomsPageRoutingModule,
    CardModule,
  ],
  declarations: [MyMushroomsPage, ModifyMushroomModalComponent],
})
export class MyMushroomsPageModule {}
