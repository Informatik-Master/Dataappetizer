import { NgModule } from '@angular/core';
import { VisualizationHost } from './visualization-host.directive';
import { GeoLocationComponent } from './geo-location.component';
import { InformationTickerComponent } from './information-ticker.component';

@NgModule({
  imports: [GeoLocationComponent, InformationTickerComponent],
  declarations: [VisualizationHost],
  exports: [
    VisualizationHost,
    GeoLocationComponent,
    InformationTickerComponent,
  ],
})
export class VisualizationModule {}
