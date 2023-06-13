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

@Component({
  standalone: true,
  selector: 'ngx-average-distance',
  imports: [CommonModule, NbCardModule, NgxEchartsModule],
  providers: [
    { provide: VisualizationComponent, useExisting: AverageDistanceComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card>
      <nb-card-header> Durchschnittsdistanz </nb-card-header>
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
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        data: [],
      },
    ],
  };

  public constructor(
    protected readonly dataPointService: DataPointService,
    private readonly changeDetectionRef: ChangeDetectorRef
  ) {
    super();
  }

  public override setMockData (): void{
    this.echartMerge = {
      series: [
        {
          data: [
            {name: "VIN1",
            value: 23423
            },
            {name: "VIN2",
            value: 12255
            },
            {name: "VIN3",
            value: 45123
            },
            {name: "VIN4",
            value: 3125
            },
            {name: "VIN5",
            value: 35245
            },
          ],
        },
      ],
    };
  }

  public ngOnInit(): void {
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
