import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCommentPage } from './add-comment';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    AddCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCommentPage),
    Ionic2RatingModule
  ],
})
export class AddCommentPageModule {}
