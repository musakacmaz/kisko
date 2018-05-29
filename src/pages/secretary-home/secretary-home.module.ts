import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecretaryHomePage } from './secretary-home';

@NgModule({
  declarations: [
    SecretaryHomePage,
  ],
  imports: [
    IonicPageModule.forChild(SecretaryHomePage),
  ],
})
export class SecretaryHomePageModule {}
