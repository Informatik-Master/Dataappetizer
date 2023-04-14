import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

import {
  control,
  FeatureGroup,
  LatLng,
  latLng,
  LayerGroup,
  Map as LefletMap,
  MapOptions,
  Marker,
  marker,
  tileLayer,
} from 'leaflet';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  vehicles = new Map<string, number>();

  markers = new Map<string, Marker>();

  ngOnInit(): void {
    const socket = new WebSocket('ws://localhost:3001');

    socket.addEventListener('open',  (event) => {
      console.log('socket open');
      console.log(event);
    });

    socket.addEventListener('message',  (event) => {
      console.log('Message from server ', event.data, typeof event.data);

      const parsed = JSON.parse(event.data);
      console.log('parsed', parsed)


      if(parsed.event === 'getDiagram') {
        this.echartMerge = {
          series: [
            {
              data: parsed.data,
            },
          ],
        };
      } else if (parsed.event === 'geolocation') {
        const {vin, value} = parsed.data
        const lat = value.latitude;
        const lng = value.longitude;
        const latLng = new LatLng(lat, lng);
        console.log('latlng',latLng)
        this.markers.set(vin, marker(latLng)),


        this.markerLayer.clearLayers();
        [...this.markers.values()].forEach((marker) => {
          this.markerLayer.addLayer(marker);
        });
        this.map?.fitBounds(this.markerLayer.getBounds().pad(.2), {animate: true, duration: 1});
      } else if (parsed.event === 'message') {
         const newMessage = `[${parsed.data.vin}] hat einen neuen Datenpunkt ${parsed.data.datapointName} mit dem Wert ${JSON.stringify(parsed.data.value||{})}`
         this.notifications = [newMessage, ...this.notifications];

         //TODO: This is still in the works
         this.vehicles.set(parsed.data.vin, (this.vehicles.get(parsed.data.vin) || 0) + 1);

      }


    });



    socket.addEventListener('error', (event) => {
      console.log('error', event);

    });

    socket.addEventListener('close', function (event) {
      console.log('socket close');
    });

    // setInterval(() => {
    //   this.socket.emit('getDiagram');
    // }, 1000)

    // this.socket.fromEvent('getDiagram').pipe(map((data) => data), tap((data) => console.log(data))).subscribe((data: any) => {
    //   console.log(data);
    //   this.echartMerge={
    //     series: [{
    //       data: data
    //     }]
    //   };
    // })
  }

  getDatapointCount() {
    return [...this.vehicles.values()].reduce((a, b) => a + b, 0);
  }

  echartMerge: EChartsOption = {};

  echartOptions: EChartsOption = {
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data: [
          { value: 4, name: 'VW' },
          { value: 3, name: 'BMW' },
          { value: 3, name: 'SEAT' },
          { value: 5, name: 'AUDI' },
          { value: 2, name: 'FORD' },
          { value: 3, name: 'OPEL' },
          { value: 1, name: 'PORSCHE' },
        ],
      },
    ],
  };

  echartOptions2: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
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
        smooth: true,
      },
    ],
  };

  notifications = [
    'Neuer Kilometerstand: 12301km',
    'Neuer Reifendruck: 2.3bar',
    'Neuer Standort: Mannheim',
    'Neuer Tankfüllstand: 30L',
  ];

  private readonly markerLayer = new FeatureGroup();
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

  map: LefletMap | null = null;

  onMapReady(map: LefletMap) {
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
