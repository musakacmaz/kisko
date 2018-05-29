import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AskDoctorPage } from './askdoctor';

@NgModule({
  declarations: [
    AskDoctorPage,
  ],
  imports: [
    IonicPageModule.forChild(AskDoctorPage),
  ],
})
export class AskDoctorPageModule {}
