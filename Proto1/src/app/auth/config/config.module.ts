import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbSelectModule,
  NbStepperModule,
} from '@nebular/theme';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConfigComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    NbCardModule,
    NbStepperModule,
    NbButtonModule,
    NbIconModule,
    FormsModule,
    NbSelectModule,
    NbInputModule,
    NbLayoutModule
  ],
})
export class ConfigModule {}
