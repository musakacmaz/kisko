import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuideListPage } from './guide-list';

@NgModule({
  declarations: [
    GuideListPage,
  ],
  imports: [
    IonicPageModule.forChild(GuideListPage),
  ],
})
export class GuideListPageModule {}
