import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
 
  echartOptions = {
    legend: {
      top: 'bottom'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          { value: 4, name: 'VW' },
          { value: 3, name: 'BMW' },
          { value: 3, name: 'SEAT' },
          { value: 5, name: 'AUDI' },
          { value: 2, name: 'FORD' },
          { value: 3, name: 'OPEL' },
          { value: 1, name: 'PORSCHE' }
        ]
      }
    ]
  };
}
