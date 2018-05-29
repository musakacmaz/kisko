import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorsMainPage } from './doctors-main';

@NgModule({
  declarations: [
    DoctorsMainPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorsMainPage),
  ],
  exports: [
    DoctorsMainPage
  ]
})
export class DoctorsMainPageModule {}
