import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckUpPage } from './check-up';

@NgModule({
  declarations: [
    CheckUpPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckUpPage),
  ],
  exports: [
    CheckUpPage
  ]
})
export class CheckUpPageModule {}
