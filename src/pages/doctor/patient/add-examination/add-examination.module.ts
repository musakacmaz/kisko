import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddExaminationPage } from './add-examination';

@NgModule({
  declarations: [
    AddExaminationPage,
  ],
  imports: [
    IonicPageModule.forChild(AddExaminationPage),
  ],
})
export class AddExaminationPageModule {}
