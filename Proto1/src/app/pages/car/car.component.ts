import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { Socket } from 'ngx-socket-io';
import { map, tap } from 'rxjs/operators';


@Component({
  selector: 'ngx-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})
export class CarComponent implements OnInit{
 
  constructor(private socket: Socket) {}

  dataSource: any;

  displayedColumns = ["vin", "oem", "drive", "kilometer", "fuel", "status", "notifi", "detail"];

  car = [{
    vin: "ZDDFC82D9847388C",
    oem: "BMW",
    drive:"Verbrenner",
    kilometer:12023,
    fuel:60,
    status:"Stillstand",
    notifi:["Fahrzeug brennt."]
  }]


  ngOnInit(): void {
      this.dataSource = this.car;
      this.socket.emit("carList");
      this.socket.fromEvent('carlist').pipe(map((data) => data), tap((data) => console.log(data))).subscribe((data: any) => {
        console.log(data);
        this.dataSource.push(data);
      })
  }

  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
  }

  
}
