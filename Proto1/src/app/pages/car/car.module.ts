import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule
} from '@nebular/theme';
import { CarComponent } from './car.component';
import { CarRoutingModule } from './car-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [CarComponent],
  imports: [
    CommonModule,
    CarRoutingModule,
    NbCardModule,
    NbActionsModule,
    NbButtonModule,
    NbIconModule,
    NgxEchartsModule.forChild(),
    MatTableModule,
    MatSortModule,
    MatProgressBarModule
  ]
})
export class CarModule {}
