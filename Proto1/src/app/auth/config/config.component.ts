import {
  animate,
  AnimationTriggerMetadata,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AVAILABLE_VISUALIZATIONS,
  VisualizationKind,
} from '../../visualizations/visualization.module';

import { System, SystemService } from '../../@core/system.service';
import { VisualizationHost } from '../../visualizations/visualization-host.directive';
import { VisualizationComponent } from 'src/app/visualizations/visualization-component.interface';

type DiagramConfig = (typeof AVAILABLE_VISUALIZATIONS)[number] & {
  selected: boolean;
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
  subscriptionId = '';

  @ViewChild(VisualizationHost, { static: true })
  previewHost!: VisualizationHost;

  configs: DiagramConfig[] = AVAILABLE_VISUALIZATIONS.map((visualization) => ({
    ...visualization,
    selected: false,
  }));

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

  newSystem: System | null = null;

  async createSystem() {
    this.newSystem = await this.systemService.createSystem({
      name: this.systemName,
      dashboardConfig: this.configs
      .filter(({ kind }) => kind === VisualizationKind.DASHBOARD)
      .filter(({ selected }) => selected)
      .map(({ id }) => id),
      detailConfig: this.configs
      .filter(({ kind }) => kind === VisualizationKind.DETAILS)
      .filter(({ selected }) => selected)
      .map(({ id }) => id),
      users: [],
      subscriptionId: this.subscriptionId,
    }); // TODO: loading?
    this.next();
  }

  finish() {
    if (!this.newSystem) return;

    this.systemService.setCurrentSystem(this.newSystem);
    this.router.navigate(['pages', this.newSystem.id]);
  }

  loadVisualization(config: DiagramConfig) {
    console.log('loadVisualization', config);
    const viewContainerRef = this.previewHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<VisualizationHost>(
      config.component
    );
    (componentRef.instance as unknown as VisualizationComponent).setMockData();
    // componentRef.instance.data = adItem.data;
  }

  async copyToClipboard(value: string | undefined) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    console.log('copied', value);
  }
}
