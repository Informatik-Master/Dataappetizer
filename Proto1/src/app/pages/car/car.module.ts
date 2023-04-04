import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule
} from '@nebular/theme';
import { CarComponent } from './car.component';
import { CarRoutingModule } from './car-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [CarComponent],
  imports: [
    CommonModule,
    CarRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NgxEchartsModule.forChild(),
  ],
})
export class CarModule {}
