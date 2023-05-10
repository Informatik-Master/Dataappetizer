import { Component } from '@angular/core';
import { DataPointService } from '../@core/data-point.service';
import { CommonModule } from '@angular/common';

import { NbCardModule, NbListModule } from '@nebular/theme';
import { filter, Subscription } from 'rxjs';
import { VisualizationComponent } from './visualization-component.interface';
import { EChartsOption, SeriesOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  standalone: true,
  selector: 'ngx-data-count',
  imports: [CommonModule, NbCardModule],
  providers: [
    { provide: VisualizationComponent, useExisting: DataCountComponent },
  ], // TODO: on push
  template: `
    <nb-card>
      <nb-card-header> Datenanzahl</nb-card-header>
      <nb-card-body>
        <h6 class="m-0"> {{vins.size}} Fahrzeuge</h6>
        <span class="caption-2"
          > {{numberDataPoints}} Datenpunkte</span
        >
      </nb-card-body>
    </nb-card>
  `,
  //TODO: shared styles
  styles: [
    `
      nb-card {
        height: 100%;
        max-height: 100%;
        margin: 0;
      }
    `,
  ],
})
export class DataCountComponent extends VisualizationComponent {
  private subscription: Subscription | null = null;

  vins = new Set<string>();
  numberDataPoints = 0;

  public constructor(protected readonly dataPointService: DataPointService) {
    super();
  }

  public ngOnInit(): void {
    this.subscription = this.dataPointService.dataPoint$
      .subscribe(({ data }) => {
        const {vin} = data;
        this.vins.add(vin);
        this.numberDataPoints++;
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
