import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilPageRoutingModule } from './profil-routing.module';
import { ProfilPage } from './profil.page';
import { PersonalDataPageModule } from './personal-data/personal-data.module';
import { MyMushroomsPageModule } from './my-mushrooms/my-mushrooms.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilPageRoutingModule,
    PersonalDataPageModule,
    MyMushroomsPageModule,
  ],
  declarations: [ProfilPage]
})
export class ProfilPageModule {}
