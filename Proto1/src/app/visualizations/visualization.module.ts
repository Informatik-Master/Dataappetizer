import { NgModule } from '@angular/core';
import { VisualizationHost } from './visualization-host.directive';
import { GeoLocationComponent } from './geo-location.component';

@NgModule({
  imports: [GeoLocationComponent],
  declarations: [VisualizationHost],
  exports: [VisualizationHost, GeoLocationComponent],
})
export class VisualizationModule {}
