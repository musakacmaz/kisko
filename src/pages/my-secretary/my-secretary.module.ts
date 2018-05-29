import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MySecretaryPage } from './my-secretary';

@NgModule({
  declarations: [
    MySecretaryPage,
  ],
  imports: [
    IonicPageModule.forChild(MySecretaryPage),
  ],
})
export class MySecretaryPageModule {}
