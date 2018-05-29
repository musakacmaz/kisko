import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionDetailsPage } from './question-details';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    QuestionDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionDetailsPage),
    Ionic2RatingModule
  ],
})
export class QuestionDetailsPageModule {}
