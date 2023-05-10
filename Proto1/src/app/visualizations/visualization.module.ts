import { NgModule } from '@angular/core';
import { VisualizationHost } from './visualization-host.directive';
import { GeoLocationComponent } from './geo-location.component';
import { InformationTickerComponent } from './information-ticker.component';
import { AverageDistanceComponent } from './average-distance.component';

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
];

const COMPONENTS = [
  GeoLocationComponent,
  InformationTickerComponent,
  AverageDistanceComponent,
];

@NgModule({
  imports: [...COMPONENTS],
  declarations: [VisualizationHost],
  exports: [
    VisualizationHost,
    ...COMPONENTS
  ],
})
export class VisualizationModule {}
