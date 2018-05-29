import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientHealthDataDetailsPage } from './patient-health-data-details';

@NgModule({
  declarations: [
    PatientHealthDataDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientHealthDataDetailsPage),
  ],
  exports: [
    PatientHealthDataDetailsPage
  ]
})
export class PatientHealthDataDetailsPageModule {}
