import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerComponent } from './picker/picker.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CardModule } from '../cards/cards.module';
import { FiltersModalMushroomComponent } from './filters-modal-mushroom/filters-modal-mushroom.component';
import { FiltersModalMyMushroomComponent } from './filters-modal-my-mushroom/filters-modal-my-mushroom.component';
import { PickerCityComponent } from './picker-city/picker-city.component';
import { FiltersModalMapComponent } from './filters-modal-map/filters-modal-map.component';

@NgModule({
  declarations: [
    PickerComponent,
    FiltersModalMyMushroomComponent,
    FiltersModalMushroomComponent,
    PickerCityComponent,
    FiltersModalMapComponent,
  ],
  exports: [
    PickerComponent,
    FiltersModalMyMushroomComponent,
    FiltersModalMushroomComponent,
    PickerCityComponent,
    FiltersModalMapComponent,
  ],
  imports: [CommonModule, IonicModule, FormsModule, CardModule],
})
export class FiltersModule {}
