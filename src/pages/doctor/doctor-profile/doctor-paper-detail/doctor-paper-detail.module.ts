import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorPaperDetailPage } from './doctor-paper-detail';

@NgModule({
  declarations: [
    DoctorPaperDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorPaperDetailPage),
  ],
})
export class DoctorPaperDetailPageModule {}
