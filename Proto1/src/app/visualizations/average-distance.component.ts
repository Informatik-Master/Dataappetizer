import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
} from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { EChartsOption, SeriesOption } from 'echarts';
import { EChartsType } from 'echarts/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { bufferTime, filter, map, Subscription } from 'rxjs';

import { DataPointService } from '../@core/data-point.service';
import { VisualizationComponent } from './visualization-component.interface';
import { DateAgoModule } from '../@core/date-ago.module';

@Component({
  standalone: true,
  selector: 'ngx-average-distance',
  imports: [CommonModule, NbCardModule, NgxEchartsModule, DateAgoModule],
  providers: [
    { provide: VisualizationComponent, useExisting: AverageDistanceComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card>
      <nb-card-header>
        <div style="display:flex; justify-content:space-between;margin-right: 1rem;">
        <span> Average Distance </span>
        <span *ngIf="ago"> (Last updated: {{ ago|dateAgo }}) </span>
    </div>
      </nb-card-header>
      <nb-card-body class="gridster-item-content">
        <div
          echarts
          [autoResize]="false"
          [options]="echartOptions"
          [merge]="echartMerge"
          (chartInit)="onChartInit($event)"
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

  echartsInstance: EChartsType | null = null;

  ago = 0;

  onChartInit(ec: any) {
    this.echartsInstance = ec;
    setTimeout(() => {
      this.onResize();
    });
  }

  @HostListener('window:resize', ['$event'])
  override onResize(): void {
    this.echartsInstance?.resize({
      animation: {
        duration: 500,
        easing: 'cubicOut',
      },
    });
  }

  // echartMerge: EChartsOption = {
  //   series: [
  //     {
  //       data: [],
  //     },
  //   ],
  // };

  echartMerge: EChartsOption = {
    series: [],
  };

  echartOptions: EChartsOption = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
    },
    xAxis: {
      type: 'category',
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
    animationDuration: 300
  };

  // echartOptions: EChartsOption = {
  //   legend: {},
  //   series: [
  //     {
  //       type: 'pie',
  //       center: ['50%', '50%'],
  //       roseType: 'area',
  //       radius: ['30%', '70%'],
  //       top: '30',
  //       itemStyle: {
  //         borderRadius: 5,
  //       },
  //       tooltip: {
  //         trigger: 'item',
  //         formatter: '{a} <br/>{b}: {c} ({d}%)',
  //       },
  //       data: [],
  //     },
  //   ],
  // };

  public constructor(
    protected readonly dataPointService: DataPointService,
    private readonly changeDetectionRef: ChangeDetectorRef
  ) {
    super();
  }

  public override setMockData(): void {
    super.setMockData();
    this.echartMerge = {
      series: [
        {
          name: "VIN1",
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          data: [
            ['18 May 2023', 20.97341150197138],
            ['19 May 2023', 32.396212924808914],
            ['20 May 2023', 10.444437939116554],
            ['21 May 2023', 42.0436064083023],
            ['22 May 2023', 0.49357440466658],
            ['23 May 2023', 0.07196788245437],
            ['24 May 2023', 10.07196788245437]
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
            ['18 May 2023', 80.97341150197138],
            ['19 May 2023', 77.396212924808914],
            ['20 May 2023', 50.444437939116554],
            ['21 May 2023', 40.0436064083023],
            ['22 May 2023', 30.49357440466658],
            ['23 May 2023', 10.07196788245437],
            ['24 May 2023', 2],
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
            ['18 May 2023', 10.97341150197138],
            ['19 May 2023', 80.396212924808914],
            ['20 May 2023', 59.444437939116554],
            ['21 May 2023', 59.0436064083023],
            ['22 May 2023', 58.49357440466658],
            ['23 May 2023', 58.07196788245437],
            ['24 May 2023', 58.07196788245437]
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
            ['18 May 2023', 48.97341150197138],
            ['19 May 2023', 40.396212924808914],
            ['20 May 2023', 35.444437939116554],
            ['21 May 2023', 20.0436064083023],
            ['22 May 2023'],
            ['23 May 2023'],
            ['24 May 2023']
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
            ['18 May 2023'],
            ['19 May 2023'],
            ['20 May 2023', 20.49357440466658],
            ['21 May 2023', 20.49357440466658],
            ['22 May 2023', 20.49357440466658],
            ['23 May 2023', 10.07196788245437],
            ['24 May 2023', 10.07196788245437]
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

  // public override setMockData(): void {
  //   super.setMockData();
  //   this.echartMerge = {
  //     series: [
  //       {
  //         data: [
  //           {
  //             name: "VIN1",
  //             value: 23423
  //           },
  //           {
  //             name: "VIN2",
  //             value: 12255
  //           },
  //           {
  //             name: "VIN3",
  //             value: 45123
  //           },
  //           {
  //             name: "VIN4",
  //             value: 3125
  //           },
  //           {
  //             name: "VIN5",
  //             value: 35245
  //           },
  //         ],
  //       },
  //     ],
  //   };
  // }

  public ngOnInit(): void {
    if (this.previewMode) return;
    this.subscription = this.dataPointService.dataPoint$
      .pipe(
        filter(({ event }) => event === 'averagedistance'),
        map(({ data }) => data.value),
        bufferTime(1000)
        // distinctUntilKeyChanged('vin')
      )
      .subscribe((bufferedEvents) => {
        for (const event of bufferedEvents) {
          const { vin, value } = event;
          const currentVal = (
            (this.echartMerge.series as SeriesOption[])[0].data as any[]
          )?.find((d) => d.name === vin);
          if (currentVal) {
            currentVal.data = value.value;
            continue;
          }
          ((this.echartMerge.series as SeriesOption[])[0].data as any[])?.push({
            name: vin,
            value: value.value,
          });
          this.ago = event.value.timestamp;
        }

        this.echartMerge = {
          ...this.echartMerge,
        };
        this.changeDetectionRef.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
