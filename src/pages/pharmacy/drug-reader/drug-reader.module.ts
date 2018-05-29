import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrugReaderPage } from './drug-reader';

@NgModule({
  declarations: [
    DrugReaderPage,
  ],
  imports: [
    IonicPageModule.forChild(DrugReaderPage),
  ],
  exports: [
    DrugReaderPage
  ]
})
export class DrugReaderPageModule {}
