import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LayoutPageRoutingModule } from './layout-routing.module';
import { LayoutPage } from './layout.page';
import { FiltersModule } from '../filters/filters.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayoutPageRoutingModule,
    FiltersModule,
  ],
  declarations: [LayoutPage],
}) // eslint-disable-line
export class LayoutPageModule {}
