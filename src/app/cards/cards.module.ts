import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecyCardComponent } from './specy-card/specy-card.component';
import { MushroomCardComponent } from './mushroom-card/mushroom-card.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [SpecyCardComponent, MushroomCardComponent ],
  imports: [CommonModule, IonicModule],
  exports: [SpecyCardComponent, MushroomCardComponent],
})
export class CardModule {}
