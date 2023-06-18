import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  HostListener,
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
import {
  bufferTime,
  debounceTime,
  filter,
  last,
  Subject,
  Subscription,
} from 'rxjs';
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
      <nb-card-header> Vehicle locations </nb-card-header>
      <nb-card-body class="p-0 gridster-item-content">
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
  latestDataPoints = new Map<string, any>();
  wasUpdated = new Subject<void>();

  vehicles = new Map<string, number>();

  @HostListener('window:resize', ['$event'])
  override onResize(): void {
    //TODO: debounce?
    this.ngZone.runOutsideAngular(() => {
      this.map?.invalidateSize();
      this.markerLayer.getLayers().length &&
        this.map?.fitBounds(this.markerLayer.getBounds().pad(0.2), {
          animate: true,
          duration: 1,
        });
    });
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
  private subscriptions: Subscription[] = [];
  private isDestroyed = false;

  public constructor(
    protected readonly dataPointService: DataPointService,
    protected readonly cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    super();
  }

  public override setMockData(): void {
    // let marker = L.marker([41.22, 8.22]);
    // marker.addTo(this.map);
    this.latestDataPoints.set("vin", {
      value: {
        latitude: 41.22,
        longitude: 8.22
      }
    });
    this.wasUpdated.next();
    console.log(this.latestDataPoints);
  }

  public ngOnInit(): void {
    this.subscriptions.push(
      this.wasUpdated.pipe(debounceTime(250)).subscribe(() => {
        this.ngZone.runOutsideAngular(() => {
          this.markerLayer.clearLayers();
          for (const [vin, { value }] of this.latestDataPoints) {
            const m = marker(new LatLng(value.latitude, value.longitude));
            m.bindPopup(vin);

            this.markerLayer.addLayer(m);
          }
        });
        this.onResize();
        this.cdr.detectChanges();
      })
    );
    this.subscriptions.push(
      this.dataPointService.dataPoint$
        .pipe(filter(({ event }) => event === 'geolocation'))
        .subscribe(({ data }) => {
          //TODO: sorting? latest, also only update leaflet on changes
          const { vin, value } = data;
          this.latestDataPoints.set(vin, value);
          this.wasUpdated.next();
        })
    );
  }

  public ngOnDestroy(): void {
    this.isDestroyed = true;
    this.subscriptions.forEach((s) => s.unsubscribe());
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
