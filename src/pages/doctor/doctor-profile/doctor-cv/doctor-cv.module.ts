import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorCvPage } from './doctor-cv';

@NgModule({
  declarations: [
    DoctorCvPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorCvPage),
  ],
  exports: [
    DoctorCvPage
  ]
})
export class DoctorCvPageModule {}
