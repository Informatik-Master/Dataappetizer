import { NgModule } from '@angular/core';
import { VisualizationHost } from './visualization-host.directive';
import { GeoLocationComponent } from './geo-location.component';
import { InformationTickerComponent } from './information-ticker.component';
import { AverageDistanceComponent } from './average-distance.component';
import { DataCountComponent } from './data-count.component';
import { MilageComponent } from './milage.component';
import { FuelLevelComponent } from './fuel-level.component';

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
    name: 'Standorte',
    kind: VisualizationKind.DASHBOARD,
    component: GeoLocationComponent,
  },
  {
    id: 'information-ticker',
    name: 'Live-Ticker',
    kind: VisualizationKind.DASHBOARD,
    component: InformationTickerComponent,
  },
  {
    id: 'average-distance',
    name: 'Durchschnittsdistanz',
    kind: VisualizationKind.DASHBOARD,
    component: AverageDistanceComponent,
  },
  {
    id: 'data-count',
    name: 'Datenanzahl',
    kind: VisualizationKind.DASHBOARD,
    component: DataCountComponent,
  },
  {
    id: 'milage',
    name: 'Kilometerstand',
    kind: VisualizationKind.DASHBOARD,
    component: MilageComponent,
  },
  {
    id: 'fuel-level',
    name: 'Tankfüllstand',
    kind: VisualizationKind.DASHBOARD,
    component: FuelLevelComponent,
  }
];

const COMPONENTS = [
  GeoLocationComponent,
  InformationTickerComponent,
  AverageDistanceComponent,
  DataCountComponent,
  MilageComponent,
  FuelLevelComponent
];

@NgModule({
  imports: [...COMPONENTS],
  declarations: [VisualizationHost],
  exports: [VisualizationHost, ...COMPONENTS],
})
export class VisualizationModule {}
