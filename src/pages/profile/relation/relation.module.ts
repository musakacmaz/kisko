import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RelationPage } from './relation';

@NgModule({
  declarations: [
    RelationPage,
  ],
  imports: [
    IonicPageModule.forChild(RelationPage),
  ],
  exports: [
    RelationPage
  ]
})
export class RelationPageModule {}
