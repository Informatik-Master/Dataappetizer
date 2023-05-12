import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbListModule
} from '@nebular/theme';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { VisualizationModule } from '../../visualizations/visualization.module';
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NgxEchartsModule.forChild(),
    NbListModule,
    LeafletModule,
    VisualizationModule,
    GridsterModule
  ],
})
export class DashboardModule {}
