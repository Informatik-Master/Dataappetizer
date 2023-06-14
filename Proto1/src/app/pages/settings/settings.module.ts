import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbListModule
} from '@nebular/theme';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { VisualizationModule } from '../../visualizations/visualization.module';
import { GridsterModule } from 'angular-gridster2';
import { ConfigModule } from 'src/app/auth/config/config.module';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ConfigModule,
    NbLayoutModule,
    NbCardModule,
  ],
})
export class SettingsModule {}
