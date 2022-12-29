import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MushroomsPageRoutingModule } from './mushrooms-routing.module';
import { MushroomsPage } from './mushrooms.page';
import { FiltersModule } from '../../filters/filters.module';
import { CardModule } from '../../cards/cards.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MushroomsPageRoutingModule,
    FiltersModule,
    CardModule,
  ],
  declarations: [MushroomsPage],
})
export class MushroomsPageModule {}
