import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorListPage } from './doctor-list';

@NgModule({
  declarations: [
    DoctorListPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorListPage),
  ],
  exports: [
    DoctorListPage
  ]
})
export class DoctorListPageModule {}
