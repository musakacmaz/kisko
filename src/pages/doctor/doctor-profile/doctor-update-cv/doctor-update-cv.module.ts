import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorUpdateCvPage } from './doctor-update-cv';

@NgModule({
  declarations: [
    DoctorUpdateCvPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorUpdateCvPage),
  ],
})
export class DoctorUpdateCvPageModule {}
