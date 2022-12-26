import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagePageRoutingModule } from './chat-routing.module';

import { MessagePage } from './chat.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MessagePageRoutingModule],
  declarations: [MessagePage],
})
export class MessagePageModule {}
