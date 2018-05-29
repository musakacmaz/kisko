import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorPaperPage } from './doctor-paper';

@NgModule({
  declarations: [
    DoctorPaperPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorPaperPage),
  ],
})
export class DoctorPaperPageModule {}
