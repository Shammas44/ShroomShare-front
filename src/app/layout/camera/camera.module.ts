import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CameraPageRoutingModule } from './camera-routing.module';
import { CameraPage } from './camera.page';
import { LayoutPageModule } from '../layout.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CameraPageRoutingModule,
    LayoutPageModule,
    ReactiveFormsModule,
  ],
  declarations: [CameraPage],
}) // eslint-disable-line
export class CameraPageModule {}
