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
import { GeoLocationComponent } from '../../visualizations/geo-location.component';

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
    GeoLocationComponent
  ],
})
export class DashboardModule {}
