import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorDetailsPage } from './doctor-details';
import { SharedModule } from '../../../app/shared.module';
import { ComponentsModule } from '../../../components/components.module';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    DoctorDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorDetailsPage),
    SharedModule,
    ComponentsModule,
    Ionic2RatingModule
  ],
  exports: [
    DoctorDetailsPage
  ]
})
export class DoctorDetailsPageModule {}
