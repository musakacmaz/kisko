import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadModalPage } from './upload-modal';

@NgModule({
  declarations: [
    UploadModalPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadModalPage),
  ],
  exports: [
    UploadModalPage
  ]
})
export class UploadModalPageModule {}
