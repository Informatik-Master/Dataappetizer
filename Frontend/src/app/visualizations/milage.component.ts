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
import { bufferTime, filter, Subscription } from 'rxjs';

import { DataPointService } from '../@core/data-point.service';
import { VisualizationComponent } from './visualization-component.interface';
import { DateAgoModule } from '../@core/date-ago.module';

@Component({
  standalone: true,
  selector: 'ngx-milage',
  imports: [CommonModule, NbCardModule, NgxEchartsModule, DateAgoModule],
  providers: [
    { provide: VisualizationComponent, useExisting: MilageComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card>
      <nb-card-header>      
      <div style="display:flex; justify-content:space-between;margin-right: 1rem;">
        <span> Mileage </span>
        <span *ngIf="ago"> (Last updated: {{ ago|dateAgo }}) </span>
      </div>
      </nb-card-header>
      <nb-card-body class="p-0 gridster-item-content">
        <div
          echarts
          [autoResize]="false"
          [options]="echartOptions"
          [merge]="echartMerge"
          style="height: 100%"
          (chartInit)="onChartInit($event)"
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
export class MilageComponent extends VisualizationComponent {
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

  echartMerge: EChartsOption = {
    series: [
      {
        data: [],
      },
    ],
  };

  echartOptions: EChartsOption = {
    tooltip: {
      trigger: 'item',
      appendToBody: true,
      show:true
    },
    legend: {},
    series: [
      {
        type: 'pie',
        center: ['50%', '50%'],
        roseType: 'area',
        radius: ['30%', '70%'],
        top: '30',
        itemStyle: {
          borderRadius: 5,
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        data: [],
      },
    ],
  };

  public constructor(
    protected readonly dataPointService: DataPointService,
    private readonly cd: ChangeDetectorRef
  ) {
    super();
  }

  // public override setMockData(): void {
  //   super.setMockData();
  //   this.echartMerge = {
  //     series: [
  //       {
  //         name: 'VIN1',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         areaStyle: {},
  //         data: [
  //           [1683700595623, 5444],
  //           [1683724083086, 5444],
  //           [1683728083086, 6000],
  //           [1683738083086, 6400],
  //         ],
  //       },
  //       {
  //         name: 'VIN2',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         areaStyle: {},
  //         data: [
  //           [1683700595623, 123],
  //           [1683724083086, 3232],
  //           [1683728083086, 3434],
  //           [1683738083086, 5434],
  //         ],
  //       },
  //       {
  //         name: 'VIN3',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         areaStyle: {},
  //         data: [
  //           [1683700595623, 123],
  //           [1683724083086, 3232],
  //           [1683728083086, 3434],
  //           [1683738083086, 5434],
  //         ],
  //       },
  //       {
  //         name: 'VIN4',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         areaStyle: {},
  //         data: [
  //           [1683700595623, 2054],
  //           [1683724083086, 2400],
  //           [1683728083086, 2400],
  //           [1683738083086, 2400],
  //         ],
  //       },
  //       {
  //         name: 'VIN5',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         areaStyle: {},
  //         data: [
  //           [1683700595623, 1203],
  //           [1683724083086, 1521],
  //           [1683728083086, 1843],
  //           [1683738083086, 2111],
  //         ],
  //       },
  //     ],
  //   };
  //   console.log(this.echartMerge);
  // }

  public override setMockData(): void {
    super.setMockData();
    this.echartMerge = {
      series: [
        {
          data: [
            {
              name: "VIN1",
              value: 23423
            },
            {
              name: "VIN2",
              value: 12255
            },
            {
              name: "VIN3",
              value: 45123
            },
            {
              name: "VIN4",
              value: 3125
            },
            {
              name: "VIN5",
              value: 35245
            },
          ],
        },
      ],
    };
  }

  public ngOnInit(): void {
    if (this.previewMode) return;
    this.subscription = this.dataPointService.dataPoint$
      .pipe(
        filter(({ event }) => event === 'mileage'),
        bufferTime(1000)
      )
      .subscribe((bufferedEvents) => {
        for (const { data } of bufferedEvents) {
          // const s = this.echartMerge.series as SeriesOption[];
          // let abc: any = s.find((s) => s.name === data.vin);
          // if (!abc) {
          //   abc = {
          //     name: data.vin,
          //     type: 'line',
          //     smooth: true,
          //     symbol: 'none',
          //     areaStyle: {},
          //     data: new Array<any[]>(),
          //   };
          //   s.push(abc);
          // }
          // abc.data!.push([data.value.timestamp, data.value.value.value]);
          // abc.data = (abc.data as any[]).sort((a: any, b: any) => a[0] - b[0]);
          
          let val = ((this.echartMerge.series as SeriesOption[])[0].data as any[]).find((d) => d.name ===data.vin)
          if(!val){
            ((this.echartMerge.series as SeriesOption[])[0].data as any[])?.push({
              name: data.vin,
              value: data.value.value.value,
            });
          }
          this.ago = data.value.timestamp;
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
