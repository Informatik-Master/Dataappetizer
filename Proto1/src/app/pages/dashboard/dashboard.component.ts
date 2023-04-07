import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Socket } from 'ngx-socket-io';
import { map, tap } from 'rxjs/operators';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private socket: Socket) {}

  ngOnInit(): void {
    setInterval(() => {
      this.socket.emit('getDiagram');
    }, 1000)

    this.socket.fromEvent('getDiagram').pipe(map((data) => data), tap((data) => console.log(data))).subscribe((data: any) => {
      console.log(data);
      this.echartMerge={
        series: [{
          data: data
        }]
      };
    })
  }

  echartMerge: EChartsOption = {
  }

  echartOptions: EChartsOption = {
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
