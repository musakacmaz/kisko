import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorAnswerPage } from './doctor-answer';

@NgModule({
  declarations: [
    DoctorAnswerPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorAnswerPage),
  ],
})
export class DoctorAnswerPageModule {}
