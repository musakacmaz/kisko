import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmsValidatePage } from './smsvalidate';

@NgModule({
  declarations: [
    SmsValidatePage,
  ],
  imports: [
    IonicPageModule.forChild(SmsValidatePage),
  ],
  exports: [
    SmsValidatePage
  ]
})
export class SmsValidatePageModule {}
