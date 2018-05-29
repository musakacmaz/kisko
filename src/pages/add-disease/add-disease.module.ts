import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDiseasePage } from './add-disease';

@NgModule({
  declarations: [
    AddDiseasePage,
  ],
  imports: [
    IonicPageModule.forChild(AddDiseasePage),
  ],
})
export class AddDiseasePageModule {}
