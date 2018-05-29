import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorCommentPage } from './doctor-comment';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    DoctorCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorCommentPage),
    Ionic2RatingModule
  ],
})
export class DoctorCommentPageModule {}
