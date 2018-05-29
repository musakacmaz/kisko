import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddHealthDataPage } from './add-health-data';

@NgModule({
  declarations: [
    AddHealthDataPage,
  ],
  imports: [
    IonicPageModule.forChild(AddHealthDataPage),
  ],
})
export class AddHealthDataPageModule {}
