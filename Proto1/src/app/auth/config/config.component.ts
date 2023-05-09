import {
  AnimationTriggerMetadata,
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { firstValueFrom } from 'rxjs';
import { SystemService } from '../../@core/system.service';
import { GeoLocationComponent } from '../../visualizations/geo-location.component';
import { VisualizationHost } from '../../visualizations/visualization-host.directive';
import { InformationTickerComponent } from '../../visualizations/information-ticker.component';
import { NbToastrService } from '@nebular/theme';

type DiagramConfig = {
  name: string;
  selected: boolean;
  component?: any;
};

export function FadeInOut(
  timingIn: number,
  timingOut: number,
  height: boolean = false
): AnimationTriggerMetadata {
  return trigger('fadeInOut', [
    transition(':enter', [
      style(height ? { opacity: 0, height: 0 } : { opacity: 0 }),
      animate(
        timingIn,
        style(height ? { opacity: 1, height: 'fit-content' } : { opacity: 1 })
      ),
    ]),
    transition(':leave', [
      animate(
        timingOut,
        style(height ? { opacity: 0, height: 0 } : { opacity: 0 })
      ),
    ]),
  ]);
}

@Component({
  selector: 'ngx-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  animations: [FadeInOut(200, 300, true)],
})
export class ConfigComponent {
  selectedIndex = 0;
  systemName = 'System Name';

  @ViewChild(VisualizationHost, { static: true })
  previewHost!: VisualizationHost;

  dashboardConfigs: DiagramConfig[] = [
    {
      name: 'Fahrzeugstandorte',
      selected: false,
      component: GeoLocationComponent,
    },
    {
      name: 'Informationsticker',
      selected: false,
      component: InformationTickerComponent,
    },
  ];
  hoveredChart: DiagramConfig | null = null;

  constructor(
    private readonly router: Router,
    private readonly systemService: SystemService
  ) {}

  previous() {
    this.selectedIndex--;
  }

  next() {
    this.selectedIndex++;
  }

  async finish() {
    const newSystem = await this.systemService.createSystem({
      name: this.systemName,
      dashboardConfig: this.dashboardConfigs
        .filter((config) => config.selected)
        .map((config) => config.name),
      detailConfig: [],
      users: [],
    }); // TODO: Is a new token needed?
    this.router.navigate(['pages', newSystem.id], {
      state: {
        woop: newSystem.id,
      },
    });
  }

  loadVisualization(config: DiagramConfig) {
    console.log('loadVisualization', config);
    const viewContainerRef = this.previewHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<VisualizationHost>(
      config.component
    );
    // componentRef.instance.data = adItem.data;
  }

  async copyToClipboard(value: string) {
    await navigator.clipboard.writeText(value);
    console.log('copied', value);
  }
}
