import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerComponent } from './picker/picker.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FiltersModalComponent } from './filters-modal/filters-modal.component';

@NgModule({
  declarations: [PickerComponent, FiltersModalComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [PickerComponent, FiltersModalComponent],
}) // eslint-disable-line
export class FiltersModule {}
