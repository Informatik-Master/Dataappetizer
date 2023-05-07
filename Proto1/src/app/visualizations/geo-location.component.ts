import { Component } from '@angular/core';
import { DataPointService } from '../@core/data-point.service';
import { CommonModule } from '@angular/common';
import {
  control,
  FeatureGroup,
  LatLng,
  latLng,
  LayerGroup,
  Map as LefletMap,
  MapOptions,
  Marker,
  marker,
  tileLayer,
} from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NbCardModule } from '@nebular/theme';
import { filter, Subscription } from 'rxjs';
import { VisualizationComponent } from './visualization-component.interface';

@Component({
  standalone: true,
  selector: 'ngx-geo-location',
  imports: [CommonModule, LeafletModule, NbCardModule],
  template: `
    <nb-card>
      <nb-card-header> Fahrzeugstandorte </nb-card-header>
      <nb-card-body class="p-0">
        <div
          leaflet
          [leafletOptions]="mapOptions"
          (leafletMapReady)="onMapReady($event)"
        ></div>
      </nb-card-body>
    </nb-card>
  `,
  styles: [
    `
      nb-card {
        height: 100%;
      }

      ::ng-deep .leaflet-top,
      ::ng-deep .leaflet-bottom {
        z-index: 997;
      }

      ::ng-deep .leaflet-container {
        width: 100%;
        height: 100%;
      }

      ::ng-deep .leaflet-control-zoom a {
        text-decoration: none;
      }
    `,
  ],
})
export class GeoLocationComponent implements VisualizationComponent {
  vehicles = new Map<string, number>();

  markers = new Map<string, Marker>();

  private readonly markerLayer = new FeatureGroup();
  mapOptions: MapOptions = {
    zoomControl: false,
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }),
      this.markerLayer,
    ],
    zoom: 5,
    center: latLng({ lat: 49.488888, lng: 8.469167 }),
    minZoom: 5,
  };

  private map: LefletMap | null = null;
  private subscription: Subscription | null = null;
  private isDestroyed = false;

  public constructor(protected readonly dataPointService: DataPointService) {}

  public ngOnInit(): void {
    this.subscription = this.dataPointService.dataPoint$
      .pipe(filter(({ event }) => event === 'geolocation'))
      .subscribe(({ data }) => {
        const { vin, value } = data;
        const lat = value.value.latitude;
        const lng = value.value.longitude;
        const latLng = new LatLng(lat, lng);
        this.markers.set(
          vin,
          marker(latLng, {
            title: vin,
          })
        ),
          this.markerLayer.clearLayers();
        [...this.markers.values()].forEach((marker) => {
          this.markerLayer.addLayer(marker);
        });
        this.map?.fitBounds(this.markerLayer.getBounds().pad(0.2), {
          animate: true,
          duration: 1,
        });
      });
  }

  public ngOnDestroy(): void {
    this.isDestroyed = true;
    this.subscription?.unsubscribe();
  }

  onMapReady(map: LefletMap) {
    this.map = map;
    this.map.setZoom(13);
    control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);
    setTimeout(() => {
      !this.isDestroyed && map.invalidateSize();
    }, 1);
  }
}
