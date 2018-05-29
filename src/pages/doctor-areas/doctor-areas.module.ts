import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorAreasPage } from './doctor-areas';

@NgModule({
  declarations: [
    DoctorAreasPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorAreasPage),
  ],
})
export class DoctorAreasPageModule {}
