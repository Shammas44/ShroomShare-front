import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CameraPageRoutingModule } from './camera-routing.module';
import { CameraPage } from './camera.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CameraPageRoutingModule, ReactiveFormsModule],
  declarations: [CameraPage],
}) // eslint-disable-line
export class CameraPageModule {}
