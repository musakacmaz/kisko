import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarTypesPage } from './calendar-types';

@NgModule({
  declarations: [
    CalendarTypesPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarTypesPage),
  ],
})
export class CalendarTypesPageModule {}
