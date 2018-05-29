import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthDataDetailsPage } from './health-data-details';

@NgModule({
  declarations: [
    HealthDataDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(HealthDataDetailsPage),
  ],
  exports: [
    HealthDataDetailsPage
  ]
})
export class HealthDataDetailsPageModule {}
