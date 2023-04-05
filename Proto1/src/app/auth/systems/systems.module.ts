import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbListModule,
  NbStepperModule,
} from '@nebular/theme';
import { SystemsRoutingModule } from './systems-routing.module';
import { SystemsComponent } from './systems.component';

@NgModule({
  declarations: [SystemsComponent],
  imports: [
    CommonModule,
    SystemsRoutingModule,
    NbCardModule,
    NbStepperModule,
    NbButtonModule,
    NbIconModule,
    NbListModule
  ],
})
export class SystemsModule {}
