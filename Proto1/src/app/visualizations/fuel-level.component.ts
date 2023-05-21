import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DataPointService } from '../@core/data-point.service';
import { CommonModule } from '@angular/common';

import { NbCardModule, NbListModule } from '@nebular/theme';
import { buffer, bufferTime, filter, Subscription } from 'rxjs';
import { VisualizationComponent } from './visualization-component.interface';
import { EChartsOption, SeriesOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  standalone: true,
  selector: 'ngx-fuel-level',
  imports: [CommonModule, NbCardModule, NgxEchartsModule],
  providers: [
    { provide: VisualizationComponent, useExisting: FuelLevelComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card>
      <nb-card-header> Tankfüllstand </nb-card-header>
      <nb-card-body class="p-0 gridster-item-content">
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
export class FuelLevelComponent extends VisualizationComponent {
  private subscription: Subscription | null = null;

  echartMerge: EChartsOption = {
    series: [],
  };

  echartOptions: EChartsOption = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
    },
    dataZoom: [
      {
        type: 'slider'
      }
    ],
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
    },
    grid: {
      right: '70px',
      left: '70px',
      bottom: '75px',
      top: '70px',
    },
    series: [], 
  };

  public constructor(protected readonly dataPointService: DataPointService, private readonly cd: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this.subscription = this.dataPointService.dataPoint$
      .pipe(
        filter(({ event }) => event === 'fuellevel'),
        bufferTime(1000)
      )
      .subscribe((bufferedEvents) => {
        for (const { data } of bufferedEvents) {
          const s = this.echartMerge.series as SeriesOption[];
          let abc: any = s.find((s) => s.name === data.vin);
          if (!abc) {
            abc = {
              name: data.vin,
              type: 'line',
              smooth: true,
              symbol: 'none',
              areaStyle: {},
              data: new Array<any[]>(),
              markLine: {
                data: [
                  { type: 'average', name: 'Avg' },
                ]
              }
            };
            s.push(abc);
          }
          abc.data!.push([data.value.timestamp, data.value.value.value]);
          abc.data = (abc.data as any[]).sort((a: any, b: any) => a[0] - b[0]);
        }

        this.echartMerge = {
          ...this.echartMerge,
        };
        this.cd.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
