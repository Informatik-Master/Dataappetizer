import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbStepperModule,
} from '@nebular/theme';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';

@NgModule({
  declarations: [ConfigComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    NbCardModule,
    NbStepperModule,
    NbButtonModule,
    NbIconModule
  ],
})
export class ConfigModule {}
