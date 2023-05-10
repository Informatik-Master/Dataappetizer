import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { DataPointService } from '../@core/data-point.service';
import { CommonModule } from '@angular/common';
import {
  control,
  FeatureGroup,
  LatLng,
  latLng,
  Map as LefletMap,
  MapOptions,
  Marker,
  marker,
  tileLayer,
} from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NbCardModule } from '@nebular/theme';
import { bufferTime, debounceTime, filter, last, Subscription } from 'rxjs';
import { VisualizationComponent } from './visualization-component.interface';

@Component({
  standalone: true,
  selector: 'ngx-geo-location',
  imports: [CommonModule, LeafletModule, NbCardModule],
  providers: [
    { provide: VisualizationComponent, useExisting: GeoLocationComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class GeoLocationComponent extends VisualizationComponent {
  vehicles = new Map<string, number>();

  markers = new Map<string, Marker>();

  override onResize(): void {
    this.map?.invalidateSize();
  }

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

  public constructor(
    protected readonly dataPointService: DataPointService,
    protected readonly cdr: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit(): void {
    this.subscription = this.dataPointService.dataPoint$
      .pipe(
        filter(({ event }) => event === 'geolocation'),
        debounceTime(500) // TODO: debounce hilft nicht, da es verschiedene Fahrzeuge mit verschiedenen Datenpunkte gibt. Demensprechend ist latest bei jedem Fahrzeug anders. Fahrzeug 1 kann am ende sine, während Fahrzeug 2 in der Mitte von dem Stream ist.
      ) //TODO: only latest,also  https://stackoverflow.com/questions/55404098/buffertime-with-leading-option
      .subscribe(({ data }) => {
         //TODO: sorting? latest, also only update leaflet on changes
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
        
        this.cdr.detectChanges();
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
