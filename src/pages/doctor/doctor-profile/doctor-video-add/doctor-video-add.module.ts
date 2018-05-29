import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorVideoAddPage } from './doctor-video-add';

@NgModule({
  declarations: [
    DoctorVideoAddPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorVideoAddPage),
  ],
})
export class DoctorVideoAddPageModule {}
