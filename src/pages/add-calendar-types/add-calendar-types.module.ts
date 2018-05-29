import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCalendarTypesPage } from './add-calendar-types';

@NgModule({
  declarations: [
    AddCalendarTypesPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCalendarTypesPage),
  ],
})
export class AddCalendarTypesPageModule {}
