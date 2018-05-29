import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorInfoUpdatePage } from './doctor-info-update';

@NgModule({
  declarations: [
    DoctorInfoUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorInfoUpdatePage),
  ],
})
export class DoctorInfoUpdatePageModule {}
