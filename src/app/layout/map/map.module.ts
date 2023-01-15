import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IonicModule } from '@ionic/angular';
import { MapPageRoutingModule } from './map-routing.module';
import { MapPage } from './map.page';
import { MapComponent } from './map/map.component';
import { FiltersModule } from 'src/app/filters/filters.module';
import { CardModule } from 'src/app/cards/cards.module';

@NgModule({
  declarations: [MapPage, MapComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    LeafletModule,
    FiltersModule,
    CardModule
  ],
})
export class MapPageModule {}
