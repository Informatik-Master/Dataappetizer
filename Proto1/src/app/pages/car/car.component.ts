import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'ngx-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})
export class CarComponent implements OnInit{
 
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
  }

  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
}
}
