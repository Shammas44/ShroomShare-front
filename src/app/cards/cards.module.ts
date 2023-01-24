import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecyCardComponent } from './specy-card/specy-card.component';
import { MushroomCardComponent } from './mushroom-card/mushroom-card.component';
import { IonicModule } from '@ionic/angular';
import { MyMushroomsCardComponent } from './my-mushrooms-card/my-mushrooms-card.component';

@NgModule({
  imports: [CommonModule, IonicModule ],
  declarations: [SpecyCardComponent, MushroomCardComponent, MyMushroomsCardComponent],
  exports: [SpecyCardComponent, MushroomCardComponent, MyMushroomsCardComponent],
})
export class CardModule {}
