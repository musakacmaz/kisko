import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMeasurementPage } from './add-measurement';

@NgModule({
  declarations: [
    AddMeasurementPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMeasurementPage),
  ],
})
export class AddMeasurementPageModule {}
