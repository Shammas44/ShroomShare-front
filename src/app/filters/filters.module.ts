import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerComponent } from './picker/picker.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CardModule } from '../cards/cards.module';
import { FiltersModalMushroomComponent } from './filters-modal-mushroom/filters-modal-mushroom.component';
import { FiltersModalMyMushroomComponent } from './filters-modal-my-mushroom/filters-modal-my-mushroom.component';

@NgModule({
  declarations: [PickerComponent, FiltersModalMyMushroomComponent, FiltersModalMushroomComponent],
  exports: [PickerComponent, FiltersModalMyMushroomComponent, FiltersModalMushroomComponent],
  imports: [CommonModule, IonicModule, FormsModule, CardModule],
})
export class FiltersModule {}
