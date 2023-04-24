import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
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
import * as L from 'leaflet';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private socket: Socket) { }

  ngOnInit(): void {
    setInterval(() => {
      this.socket.emit('getDiagram');
    }, 10000)

    this.socket.fromEvent('getDiagram').pipe(map((data) => data), tap((data) => console.log(data))).subscribe((data: any) => {
      hideloader();
      showContent();

      this.amountVehicle = data.length;
      for(let i = 0; i < data.length; i++){
        this.notifications.push(""+ data[i].name + " | Average Distance: " + data[i].value + "km");
      }
      this.amountVehicle = data[0].vehicles.length;
      this.amountDataPoints = data[0].livetickerData[0].length;
      this.geolocationData = data[0].geolocationData;
      this.echartMerge = {
        series: [{
          data: data[0].averageDistanceData
        }]
      };
      for (let i = 0; i < data[0].livetickerData.length; i++) {
        for (let j = 0; j < data[0].livetickerData[i].length; j++) {
          let dataSet = data[0].livetickerData[i][j];
          if (dataSet.secondValue != "") {
            this.notifications.push("VIN: " + dataSet.vin + " | Datapoint: " + dataSet.datapoint + " | Value: " + dataSet.value + " " + dataSet.unit + " | Second Value: " + dataSet.secondValue + " " + dataSet.unit + " | Timestamp: " + dataSet.timestamp);
          } else {
            this.notifications.push("VIN: " + dataSet.vin + " | Datapoint: " + dataSet.datapoint + " | Value: " + dataSet.value + " " + dataSet.unit + " | Timestamp: " + dataSet.timestamp);
          }
        }
      }
    })

    function hideloader() {
      let spinner = document.getElementById('loading');
      spinner!.style.display = 'none';
    }

    function showContent(){
      document.querySelectorAll('.container').forEach(function (element) {
        element.setAttribute("class", "row");
      });
    }

  }

  amountVehicle = 0;
  amountDataPoints = 0;
  geolocationData = [];

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
    setInterval(() => {
      this.showGeolocation(map);
    }, 10000);
  }

markers:any = [];

//TODO: fitBounds nur einmalig
//TODO: Map schon beim Initialladen laden
//TODO: Map sollte beim Aktualisieren der Daten geladen werden und nicht separat im eigenen Thread
  showGeolocation(map: Map) {
    console.log("MAP WAS UPDATED");
    for(let i = 0; i < this.markers.length; i++){
      map.removeLayer(this.markers[i]);
    }
    this.markers = []; //reset
    let bounds: any = [];
    for (let i = 0; i < this.geolocationData.length; i++) {
      let latitude = this.geolocationData[i]['geolocation']['latitude'];
      let longitude = this.geolocationData[i]['geolocation']['longitude'];
      let vin = this.geolocationData[i]['vin'];
      let marker = L.marker([latitude, longitude]);
      marker.addTo(map).bindPopup(vin);
      this.markers.push(marker);
      bounds.push([latitude, longitude]);
    }
    if(bounds.length != 0){
      map.fitBounds(bounds);
    }
    console.log(this.markers);
  }
}
