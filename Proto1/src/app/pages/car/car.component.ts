import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})
export class CarComponent {
 
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
          { value: 40, name: 'VW' },
          { value: 38, name: 'BMW' },
          { value: 32, name: 'SEAT' },
          { value: 32, name: 'AUDI' },
          { value: 32, name: 'FORD' },
          { value: 32, name: 'OPEL' },
          { value: 18, name: 'PORSCHE' }
        ]
      }
    ]
  };
}
