import {
  AnimationTriggerMetadata,
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { firstValueFrom } from 'rxjs';
import { SystemService } from '../../@core/system.service';

type DiagramConfig = {
  //TODO: id from backend
  name: string;
  selected: boolean;
  chart?: EChartsOption; //TODO: Or component?
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

  organization = 0;

  systemName = 'System Name';

  hoveredChart: DiagramConfig | null = null;

  dashboardConfigs: DiagramConfig[] = [
    {
      name: 'Anzahl der Fahrzeuge',
      selected: false,
    },
    {
      name: 'Herstellerverteilung',
      selected: false,
      chart: {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' },
            ],
          },
        ],
      },
    },
    {
      name: 'Informationsticker',
      selected: false,
    },
  ];
  carConfigs: DiagramConfig[] = [
    {
      name: 'Kilometerstand',
      selected: false,
      chart: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['Auto 1', 'Auto 2', 'Auto 3'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Auto 1',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: 'Auto 2',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: 'Auto 3',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [150, 232, 201, 154, 190, 330, 410],
          },
        ],
      },
    },
    {
      name: 'Informationsticker',
      selected: false,
    },
  ];

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

  async finish() {
    const newSystem = await firstValueFrom(
      this.systemService.createSystem(this.systemName)
    );
    this.router.navigate(['pages', newSystem.id]);
  }
}
