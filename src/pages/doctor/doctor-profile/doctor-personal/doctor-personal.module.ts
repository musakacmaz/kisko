import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorPersonalPage } from './doctor-personal';

@NgModule({
  declarations: [
    DoctorPersonalPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorPersonalPage),
  ],
})
export class DoctorPersonalPageModule {}
