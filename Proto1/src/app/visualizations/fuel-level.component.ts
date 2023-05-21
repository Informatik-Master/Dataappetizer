import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { EChartsOption, SeriesOption } from 'echarts';
import { EChartsType } from 'echarts/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { bufferTime, filter, Subscription } from 'rxjs';

import { DataPointService } from '../@core/data-point.service';
import { VisualizationComponent } from './visualization-component.interface';

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
          [autoResize]="false"
          [options]="echartOptions"
          [merge]="echartMerge"
          style="height: 100%;"
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
export class FuelLevelComponent extends VisualizationComponent {
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
        type: 'slider',
      },
      {
        type: 'inside',
      },
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

  public constructor(
    protected readonly dataPointService: DataPointService,
    private readonly cd: ChangeDetectorRef
  ) {
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
                data: [{ type: 'average', name: 'Avg' }],
              },
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
