import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecyCardComponent } from './specy-card/specy-card.component';
import { MushroomCardComponent } from './mushroom-card/mushroom-card.component';
import { IonicModule } from '@ionic/angular';
import { MyMushroomsCardComponent } from './my-mushrooms-card/my-mushrooms-card.component';

@NgModule({
  declarations: [SpecyCardComponent, MushroomCardComponent, MyMushroomsCardComponent],
  imports: [CommonModule, IonicModule],
  exports: [SpecyCardComponent, MushroomCardComponent, MyMushroomsCardComponent],
})
export class CardModule {}
