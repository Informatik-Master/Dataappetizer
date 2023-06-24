import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
} from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { EChartsOption } from 'echarts';
import { EChartsType } from 'echarts/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { bufferTime, filter, Subscription } from 'rxjs';

import { DataPointService } from '../@core/data-point.service';
import { VisualizationComponent } from './visualization-component.interface';

@Component({
  standalone: true,
  selector: 'ngx-environment-temperature',
  imports: [CommonModule, NbCardModule, NgxEchartsModule],
  providers: [
    {
      provide: VisualizationComponent,
      useExisting: EnvironmentTemperatureComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card>
      <nb-card-header> Environment temperature </nb-card-header>
      <nb-card-body class="p-0 gridster-item-content">
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
export class EnvironmentTemperatureComponent extends VisualizationComponent {
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
    xAxis: {
      data: [],
    },
    series: [{ data: [] }],
  };

  echartOptions: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
  };

  public constructor(
    protected readonly dataPointService: DataPointService,
    private readonly cd: ChangeDetectorRef
  ) {
    super();
  }

  public override setMockData(): void {
    super.setMockData();
    this.echartMerge = {
      series:  [{
        data: [20,19,21, 18, 26]
      }],
      xAxis: {
        data: ['VIN1', 'VIN2', 'VIN3', 'VIN4', 'VIN5']
      }
    }
  }

  vinSeriesMap: Map<string, number> = new Map<string, number>();

  public ngOnInit(): void {
    if (this.previewMode) return;
    this.subscription = this.dataPointService.dataPoint$
      .pipe(
        filter(({ event }) => event === 'environmentaltemperature'),
        bufferTime(1000)
      )
      .subscribe((bufferedEvents) => {
        for (const { data } of bufferedEvents) {
          const vin = data.vin;
          const value = data.value.value.value;

          if (!this.vinSeriesMap.has(vin)) {
            this.vinSeriesMap.set(vin, this.vinSeriesMap.size);

            (this.echartMerge.series as any)[0].data.push(value);
            (this.echartMerge.xAxis as any).data.push(vin);
          } else {
            const index = this.vinSeriesMap.get(vin)!;
            (this.echartMerge.series as any)[0].data[index] = value;
          }
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
