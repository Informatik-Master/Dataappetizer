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
import { firstValueFrom, map } from 'rxjs';
import { SystemService } from 'src/app/@core/system.service';
import { VisualizationComponent } from 'src/app/visualizations/visualization-component.interface';

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {

  system$ = this.systemService.currentSystem;

  public constructor(private readonly systemService: SystemService) {

  }
}
