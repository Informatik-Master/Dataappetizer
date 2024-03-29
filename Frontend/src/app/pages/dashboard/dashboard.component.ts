import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { firstValueFrom, map } from 'rxjs';
import { SystemService } from 'src/app/@core/system.service';
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

  public constructor(private readonly systemService: SystemService, private readonly changeRef: ChangeDetectorRef) {

  }

  showGeoLocation: boolean = false;
  showInformationTicker: boolean = false;
  showAverageDistance: boolean = false;
  showDataCount: boolean = false;
  showMileage: boolean = false;
  showFuelLevel: boolean = false;
  showEnvironmentTemperature: boolean = false;

  onResize(item: GridsterItem): void {
    this.nestedVisualizations?.forEach((visualization) => {
      // TODO:
      visualization.onResize();
    });
  }

  max: any;

  async ngOnInit(): Promise<void> {
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.CompactLeftAndUp,
      pushResizeItems: true,
      maxCols: 12,
      maxRows: 14,
      pushItems: true,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
    };

    this.dashboard = [
      { cols: 2, rows: 4, y: 0, x: 2 }, //geolocation
      { cols: 1, rows: 2, y: 0, x: 0 }, //data count
      { cols: 1, rows: 2, y: 0, x: 1 }, //mileage
      { cols: 2, rows: 2, y: 1, x: 0 }, //fuel level
      { cols: 2, rows: 2, y: 2, x: 0 }, //information ticker
      { cols: 1, rows: 2, y: 2, x: 1 },  //env. temp.
      { cols: 1, rows: 2, y: 2, x: 2 },  //Avg. Distance
    ];
    await this.checkTags();
  }

  async checkTags() {
    const currentSystem = await firstValueFrom(this.systemService.currentSystem)
    if (currentSystem == null) {
      return;
    }
    let dashboardConfig = currentSystem.dashboardConfig;
    console.log('current', currentSystem)
    for (let i = 0; i < dashboardConfig?.length; i++) {
      if (dashboardConfig[i] == "geo-location") {
        this.showGeoLocation = true;
      } else if (dashboardConfig[i] == "information-ticker") {
        this.showInformationTicker = true;
      } else if (dashboardConfig[i] == "average-distance") {
        this.showAverageDistance = true;
      } else if (dashboardConfig[i] == "data-count") {
        this.showDataCount = true;
      } else if (dashboardConfig[i] == "milage") {
        this.showMileage = true;
      } else if (dashboardConfig[i] == "fuel-level") {
        this.showFuelLevel = true;
      } else if (dashboardConfig[i] == "environment-temperature") {
        this.showEnvironmentTemperature = true;
      }
    }
    this.changeRef.detectChanges();
  }

  resizeInterval() {
    setTimeout(() => {
      this.onResize(this.dashboard[0]);
    }, 500);
  }
}
