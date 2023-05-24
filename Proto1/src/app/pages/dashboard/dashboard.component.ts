import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CompactType,
  GridsterConfig,
  GridsterItem,
  GridType,
} from 'angular-gridster2';
import { map } from 'rxjs';
import { VisualizationComponent } from 'src/app/visualizations/visualization-component.interface';

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

  public constructor(private readonly activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap
      .pipe(
        map(() => window.history.state) // unsubscirpe
      )
      .subscribe(({ system }) => {
        console.log('system', system);
      });
  }

  onResize(item: GridsterItem): void {
    this.nestedVisualizations?.forEach((visualization) => {
      // TODO:
      visualization.onResize();
    });
  }

  max: any;

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
      { cols: 2, rows: 2, y: 0, x: 2 },

      { cols: 1, rows: 1, y: 0, x: 0 },
      { cols: 1, rows: 1, y: 0, x: 1 },
      { cols: 2, rows: 1, y: 1, x: 0 },
      { cols: 4, rows: 1, y: 2, x: 0 },
    ];
  }

  resizeInterval() {
    setTimeout(() => {
      this.onResize(this.dashboard[0]);
    }, 500);
  }
}
