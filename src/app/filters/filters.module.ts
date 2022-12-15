import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerComponent } from './picker/picker.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { FiltersModalComponent } from './filters-modal/filters-modal.component';

@NgModule({
  declarations: [PickerComponent, FiltersModalComponent, CardComponent],
  exports: [PickerComponent, FiltersModalComponent, CardComponent],
  imports: [CommonModule, IonicModule, FormsModule],
}) // eslint-disable-line
export class FiltersModule {}
