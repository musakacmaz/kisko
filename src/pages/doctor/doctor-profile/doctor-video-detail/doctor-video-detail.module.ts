import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorVideoDetailPage } from './doctor-video-detail';

@NgModule({
  declarations: [
    DoctorVideoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorVideoDetailPage),
  ],
})
export class DoctorVideoDetailPageModule {}
