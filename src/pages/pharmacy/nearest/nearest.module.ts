import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NearestPage } from './nearest';

@NgModule({
  declarations: [
    NearestPage,
  ],
  imports: [
    IonicPageModule.forChild(NearestPage),
  ],
  exports: [
    NearestPage
  ]
})
export class NearestPageModule {}
