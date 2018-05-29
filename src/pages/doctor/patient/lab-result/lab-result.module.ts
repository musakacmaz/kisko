import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LabResultPage } from './lab-result';

@NgModule({
  declarations: [
    LabResultPage,
  ],
  imports: [
    IonicPageModule.forChild(LabResultPage),
  ],
  exports: [
    LabResultPage
  ]
})
export class LabResultPageModule {}
