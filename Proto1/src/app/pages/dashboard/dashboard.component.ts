import {
  ViewChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  OnInit,
  QueryList,
} from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';

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
import ReconnectingWebSocket from 'reconnecting-websocket';

import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridType,
} from 'angular-gridster2';
import { VisualizationComponent } from 'src/app/visualizations/visualization-component.interface';
import { ActivatedRoute } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  options!: GridsterConfig;
  dashboard!: Array<GridsterItem>;

  @ViewChildren(VisualizationComponent)
  nestedVisualizations: QueryList<VisualizationComponent> | null = null;

  onResize(item: GridsterItem): void {
    this.nestedVisualizations?.forEach((visualization) => {
      // TODO:
      visualization.onResize();
    });
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      maxCols: 10,
      maxRows: 10,
      pushItems: true,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
    };

    this.dashboard = [
      { cols: 1, rows: 2, y: 0, x: 2 },

      { cols: 1, rows: 1, y: 0, x: 0 },
      { cols: 1, rows: 1, y: 0, x: 1 },
      { cols: 2, rows: 1, y: 1, x: 0 },
      { cols: 3, rows: 1, y: 2, x: 0 },
    ];
  }
}
