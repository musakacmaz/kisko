import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatientInfoPage } from './patient-info';

@NgModule({
  declarations: [
    PatientInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PatientInfoPage),
  ],
})
export class PatientInfoPageModule {}
