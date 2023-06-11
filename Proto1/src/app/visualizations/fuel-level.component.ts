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
      },
      {
        type: 'inside'
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

  public override setMockData(): void {
    this.echartMerge = {
      series: [
        {
          name: "VIN1",
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          data: [
            [1683700595623, 20.97341150197138],
            [1683700595623, 60.396212924808914],
            [1683724083086, 58.444437939116554],
            [1683728083086, 52.0436064083023],
            [1683738083086, 48.49357440466658],
            [1683758083086, 40.07196788245437]
          ],
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
            ]
          }
        },
        {
          name: "VIN2",
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          data: [
            [1683700595623, 80.97341150197138],
            [1683700595623, 77.396212924808914],
            [1683724083086, 50.444437939116554],
            [1683728083086, 40.0436064083023],
            [1683738083086, 30.49357440466658],
            [1683758083086, 10.07196788245437]
          ],
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
            ]
          }
        },
        {
          name: "VIN3",
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          data: [
            [1683700595623, 10.97341150197138],
            [1683700595623, 80.396212924808914],
            [1683724083086, 59.444437939116554],
            [1683728083086, 59.0436064083023],
            [1683738083086, 58.49357440466658],
            [1683758083086, 58.07196788245437]
          ],
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
            ]
          }
        },
        {
          name: "VIN4",
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          data: [
            [1683700595623, 48.97341150197138],
            [1683700595623, 40.396212924808914],
            [1683724083086, 35.444437939116554],
            [1683728083086, 20.0436064083023],
            [1683738083086],
            [1683758083086]
          ],
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
            ]
          }
        },
        {
          name: "VIN5",
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          data: [
            [1683700595623],
            [1683700595623],
            [1683724083086, 20.49357440466658],
            [1683728083086, 20.49357440466658],
            [1683738083086, 20.49357440466658],
            [1683758083086, 10.07196788245437]
          ],
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
            ]
          }
        }
      ]
    }
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
