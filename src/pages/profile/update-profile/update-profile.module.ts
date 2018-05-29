import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateProfilePage } from './update-profile';

@NgModule({
  declarations: [
    UpdateProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateProfilePage),
  ],
  exports: [
    UpdateProfilePage
  ]
})
export class UpdateProfilePageModule {}
