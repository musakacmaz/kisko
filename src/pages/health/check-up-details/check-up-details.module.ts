import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckUpDetailsPage } from './check-up-details';

@NgModule({
  declarations: [
    CheckUpDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckUpDetailsPage),
  ],
  exports: [
    CheckUpDetailsPage
  ]
})
export class CheckUpDetailsPageModule {}
