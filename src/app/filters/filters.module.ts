import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerComponent } from './picker/picker.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FiltersModalComponent } from './filters-modal/filters-modal.component';
import {CardModule} from '../cards/cards.module'

@NgModule({
  declarations: [PickerComponent, FiltersModalComponent],
  exports: [PickerComponent, FiltersModalComponent],
  imports: [CommonModule, IonicModule, FormsModule, CardModule  ],
})
export class FiltersModule {}
