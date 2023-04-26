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
import { time } from 'console';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private socket: Socket) { }

  timestamp = "gerade eben";
  timeCounter = 0;


  ngOnInit(): void {

    // this.socket.fromEvent('overviewData').subscribe((data: any) => {
    //   console.log("DATA",data);
    //   this.amountVehicle = data[0].vehicles.length;
    //   this.amountDataPoints = data[0].livetickerData[0].length;
    //   this.geolocationData = data[0].geolocationData;
    //   this.echartMerge = {
    //     series: [{
    //       data: data[0].averageDistanceData
    //     }]
    //   };
    //   for (let i = 0; i < data[0].livetickerData.length; i++) {
    //     for (let j = 0; j < data[0].livetickerData[i].length; j++) {
    //       let dataSet = data[0].livetickerData[i][j];
    //       if (dataSet.secondValue != "") {
    //         this.notifications.push("VIN: " + dataSet.vin + " | Datapoint: " + dataSet.datapoint + " | Value: " + dataSet.value + " " + dataSet.unit + " | Second Value: " + dataSet.secondValue + " " + dataSet.unit + " | Timestamp: " + dataSet.timestamp);
    //       } else {
    //         this.notifications.push("VIN: " + dataSet.vin + " | Datapoint: " + dataSet.datapoint + " | Value: " + dataSet.value + " " + dataSet.unit + " | Timestamp: " + dataSet.timestamp);
    //       }
    //     }
    //   }
    // })

    this.socket.emit('overview');
    this.startTimeCounter();
    this.intervalls.push(setInterval(() => {
      this.socket.emit('overview');
    }, 10000))
    this.socket.fromEvent('overview').pipe(map((data) => data), tap((data) => console.log(data))).subscribe((data: any) => {
      this.hideloader();
      this.showContent();
      this.timestamp = "gerade eben";
      this.timeCounter = 0;

      this.amountVehicle = data[0].vehicles.length;
      this.amountDataPoints += data[0].livetickerData[0].length;
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
  }
  startTimeCounter() {
    setInterval(() => {
      this.timeCounter += 10;
      this.timestamp = "vor " + this.timeCounter + " sek."
    }, 10000);
  }

  hideloader() {
    let spinner = document.getElementById('loading');
    spinner!.style.display = 'none';
  }

  showContent(){
    document.querySelectorAll('.container').forEach(function (element) {
      element.setAttribute("class", "row");
    });
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
    tooltip: {
      trigger: 'item',
      appendToBody: true,
    },
    series: [
      {
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
        data: [82, 93, 90, 93, 100, 50, 80],
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

  intervalls: NodeJS.Timer[] = []
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
    this.intervalls.push(setInterval(() => {
      this.showGeolocation(map);
    }, 1000));
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
    this.markers = [];
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
      map.fitBounds(bounds, {padding:[1,1]});
    }
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.intervalls.length; i++) {
      clearInterval(this.intervalls[i]);
    }
  }
}
