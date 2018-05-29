import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientExaminationPage } from './patient-examination';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    PatientExaminationPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientExaminationPage),
    Ionic2RatingModule
  ],
  exports: [
    PatientExaminationPage
  ]
})
export class PatientExaminationPageModule {}
