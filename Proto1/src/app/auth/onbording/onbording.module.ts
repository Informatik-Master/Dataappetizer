import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbStepperModule,
} from '@nebular/theme';
import { OnbordingRoutingModule } from './onbording-routing.module';
import { OnbordingComponent } from './onbording.component';

@NgModule({
  declarations: [OnbordingComponent],
  imports: [
    CommonModule,
    OnbordingRoutingModule,
    NbCardModule,
    NbStepperModule,
    NbButtonModule,
    NbIconModule
  ],
})
export class OnbordingModule {}
