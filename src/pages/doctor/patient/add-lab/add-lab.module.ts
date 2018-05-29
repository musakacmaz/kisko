import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLabPage } from './add-lab';

@NgModule({
  declarations: [
    AddLabPage,
  ],
  imports: [
    IonicPageModule.forChild(AddLabPage),
  ],
  exports: [
    AddLabPage
  ]
})
export class AddLabPageModule {}
