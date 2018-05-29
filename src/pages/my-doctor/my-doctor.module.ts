import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyDoctorPage } from './my-doctor';

@NgModule({
  declarations: [
    MyDoctorPage,
  ],
  imports: [
    IonicPageModule.forChild(MyDoctorPage),
  ],
})
export class MyDoctorPageModule {}
