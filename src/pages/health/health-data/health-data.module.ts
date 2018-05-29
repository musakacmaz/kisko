import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthDataPage } from './health-data';

@NgModule({
  declarations: [
    HealthDataPage,
  ],
  imports: [
    IonicPageModule.forChild(HealthDataPage),
  ],
  exports: [
    HealthDataPage
  ]
})
export class HealthDataPageModule {}
