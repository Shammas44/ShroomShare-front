import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritesPageRoutingModule } from './favorites-routing.module';

import { FavoritesPage } from './favorites.page';
import { LocalStorageService } from 'src/app/localStorage/local-storage.service';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
  imports: [
  
  CommonModule,
    FormsModule,
    IonicModule,
    FavoritesPageRoutingModule,
    IonicStorageModule,
  ],
  declarations: [FavoritesPage],
  providers: [LocalStorageService],
})
export class FavoritesPageModule {}
