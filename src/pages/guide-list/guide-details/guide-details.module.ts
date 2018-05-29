import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuideDetailsPage } from './guide-details';

@NgModule({
  declarations: [
    GuideDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(GuideDetailsPage),
  ],
})
export class GuideDetailsPageModule {}
