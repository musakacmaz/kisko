import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ShrinkingSegmentHeader } from './shrinking-segment-header/shrinking-segment-header';

@NgModule({
  declarations: [
    ShrinkingSegmentHeader
  ],
  imports: [
    IonicModule
    ],
  exports: [
    ShrinkingSegmentHeader
  ]
})
export class ComponentsModule {}
