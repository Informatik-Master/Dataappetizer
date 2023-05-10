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
  selector: 'ngx-average-distance',
  imports: [CommonModule, NbCardModule, NgxEchartsModule],
  providers: [
    { provide: VisualizationComponent, useExisting: AverageDistanceComponent },
  ], // TODO: on push
  template: `
    <nb-card>
      <nb-card-header> Durchschnittsdistanz </nb-card-header>
      <nb-card-body>
        <div
          echarts
          [options]="echartOptions"
          [merge]="echartMerge"
          style="height: 100%"
        ></div>
      </nb-card-body>
    </nb-card>
  `,
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
export class AverageDistanceComponent extends VisualizationComponent {
  private subscription: Subscription | null = null;

  echartMerge: EChartsOption = {
    series: [{
       data: []
      }],
  };

  echartOptions: EChartsOption = {
    legend: {
      top: 'bottom',
    },
    series: [
      {
        type: 'pie',
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        data: [],
      },
    ],
  };

  public constructor(protected readonly dataPointService: DataPointService) {
    super();
  }

  public ngOnInit(): void {
    this.subscription = this.dataPointService.dataPoint$
      .pipe(filter(({ event }) => event === 'averagedistance'))
      .subscribe(({ data }) => {
        const currentVal = (
          (this.echartMerge.series as SeriesOption[])[0].data as any[]
        )?.find((d) => d.name === data.value.vin);
        if (currentVal) {
          currentVal.data = data.value.value.value;
        } else {
          ((this.echartMerge.series as SeriesOption[])[0].data as any[])?.push({
            name: data.value.vin,
            value: data.value.value.value,
          });
        }
        this.echartMerge = {
          ...this.echartMerge,
        };
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
