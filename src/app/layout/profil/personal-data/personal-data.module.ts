import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PersonalDataPageRoutingModule } from './personal-data-routing.module';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { PersonalDataPage } from './personal-data.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PersonalDataPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [PersonalDataPage]
})
export class PersonalDataPageModule {}
