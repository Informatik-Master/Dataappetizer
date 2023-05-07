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
import { SocketIoModule } from 'ngx-socket-io';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { VisualizationModule } from '../../visualizations/visualization.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NgxEchartsModule.forChild(),
    SocketIoModule,
    NbListModule,
    LeafletModule,
    VisualizationModule
  ],
})
export class DashboardModule {}
