import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Socket } from 'ngx-socket-io';
import { map, tap } from 'rxjs/operators';
import { EChartsOption } from 'echarts';

import {
  control,
  LatLng,
  latLng,
  LayerGroup,
  Map,
  MapOptions,
  marker,
  tileLayer,
} from 'leaflet';

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
    }, 60000)

    this.socket.fromEvent('getDiagram').pipe(map((data) => data), tap((data) => console.log(data))).subscribe((data: any) => {
      this.amountVehicle = data.length;
      for(let i = 0; i < data.length; i++){
        this.notifications.push(""+ data[i].name + " | Average Distance: " + data[i].value + "km");
      }
      this.echartMerge={
        series: [{
          data: data
        }]
      };
    })
  }

  amountVehicle = 0;

  notifications: String[] = [
    // 'Neuer Kilometerstand: 12301km',
    // 'Neuer Reifendruck: 2.3bar',
    // 'Neuer Standort: Mannheim',
    // 'Neuer Tankfüllstand: 30L',
  ];

  echartMerge: EChartsOption = {
  }

  echartOptions: EChartsOption = {
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

  echartOptions2: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value'
    },
    grid: {
      right: '10px',
      left: '50px',
      bottom: '25px',
      top: '15px',
    },
    series: [
      {

        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
      }
    ]
  };

  private readonly markerLayer = new LayerGroup();
  mapOptions: MapOptions = {
    zoomControl: false,
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }),
      this.markerLayer,
    ],
    zoom: 5,
    center: latLng({ lat: 49.488888, lng: 8.469167 }),
    minZoom: 5,
  };

  map: Map | null = null;

  onMapReady(map: Map) {
    this.map = map;
    this.map.setZoom(13);
    control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);
      setTimeout(() => {
        map.invalidateSize();
      }, 10);
    }
}
