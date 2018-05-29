import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorInfoPage } from './doctor-info';

@NgModule({
  declarations: [
    DoctorInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorInfoPage),
  ],
})
export class DoctorInfoPageModule {}
