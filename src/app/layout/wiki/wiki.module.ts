import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WikiPageRoutingModule } from './wiki-routing.module';
import { WikiPage } from './wiki.page';
import { FiltersModule } from '../../filters/filters.module';
import { CardModule } from '../../cards/cards.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WikiPageRoutingModule,
    FiltersModule,
    CardModule,
  ],
  declarations: [WikiPage],
})
export class WikiPageModule {}
