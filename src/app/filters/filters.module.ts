import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PickerComponent} from './picker/picker.component'
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PickerComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports: [
    PickerComponent
  ]
})
export class FiltersModule { }
