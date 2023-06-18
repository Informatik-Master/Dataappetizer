import { NgModule } from '@angular/core';
import { VisualizationHost } from './visualization-host.directive';
import { GeoLocationComponent } from './geo-location.component';
import { InformationTickerComponent } from './information-ticker.component';
import { AverageDistanceComponent } from './average-distance.component';
import { DataCountComponent } from './data-count.component';
import { MilageComponent } from './milage.component';
import { FuelLevelComponent } from './fuel-level.component';
import { EnvironmentTemperatureComponent } from './environment-temperature.component';

export enum VisualizationKind {
  DASHBOARD = 'dashboard',
  DETAILS = 'details',
}

export const AVAILABLE_VISUALIZATIONS: {
  id: string;
  name: string;
  kind: VisualizationKind;
  component: any; //FIXME:
}[] = [
  {
    id: 'geo-location',
    name: 'Vehicle locations',
    kind: VisualizationKind.DASHBOARD,
    component: GeoLocationComponent,
  },
  {
    id: 'information-ticker',
    name: 'Informationticker',
    kind: VisualizationKind.DASHBOARD,
    component: InformationTickerComponent,
  },
  {
    id: 'average-distance',
    name: 'Average Distance',
    kind: VisualizationKind.DASHBOARD,
    component: AverageDistanceComponent,
  },
  {
    id: 'data-count',
    name: 'Datacount',
    kind: VisualizationKind.DASHBOARD,
    component: DataCountComponent,
  },
  {
    id: 'milage',
    name: 'Milage',
    kind: VisualizationKind.DASHBOARD,
    component: MilageComponent,
  },
  {
    id: 'fuel-level',
    name: 'Fuellevel',
    kind: VisualizationKind.DASHBOARD,
    component: FuelLevelComponent,
  },
  {
    id: 'environment-temperature',
    name: 'Environment temperature',
    kind: VisualizationKind.DASHBOARD,
    component: EnvironmentTemperatureComponent
  }
];

const COMPONENTS = [
  GeoLocationComponent,
  InformationTickerComponent,
  AverageDistanceComponent,
  DataCountComponent,
  MilageComponent,
  FuelLevelComponent,
  EnvironmentTemperatureComponent
];

@NgModule({
  imports: [...COMPONENTS],
  declarations: [VisualizationHost],
  exports: [VisualizationHost, ...COMPONENTS],
})
export class VisualizationModule {}
