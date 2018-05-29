import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorVideoPage } from './doctor-video';

@NgModule({
  declarations: [
    DoctorVideoPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorVideoPage),
  ],
})
export class DoctorVideoPageModule {}
