import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorMapPage } from './doctor-map';

@NgModule({
  declarations: [
    DoctorMapPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorMapPage),
  ],
  exports: [
    DoctorMapPage
  ]
})
export class DoctorMapPageModule {}
