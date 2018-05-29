import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthHistoryPage } from './health-history';

@NgModule({
  declarations: [
    HealthHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(HealthHistoryPage),
  ],
})
export class HealthHistoryPageModule {}
