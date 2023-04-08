import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbSelectModule,
  NbStepperModule,
  NbTabsetModule,
} from '@nebular/theme';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';

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
    NbLayoutModule,
    NbTabsetModule,
    NbListModule,
    NbCheckboxModule,
    NgxEchartsModule.forChild(),
  ],
})
export class ConfigModule {}
