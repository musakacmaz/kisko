import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSecretaryPage } from './add-secretary';

@NgModule({
  declarations: [
    AddSecretaryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSecretaryPage),
  ],
})
export class AddSecretaryPageModule {}
