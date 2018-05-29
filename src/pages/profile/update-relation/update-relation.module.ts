import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateRelationPage } from './update-relation';

@NgModule({
  declarations: [
    UpdateRelationPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateRelationPage),
  ],
  exports: [
    UpdateRelationPage
  ]
})
export class UpdateRelationPageModule {}
