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
export class CarComponent implements OnInit {

  constructor(private socket: Socket, private readonly router: Router
  ) { }

  dataSource: any;

  displayedColumns = ["vin", "mileage", "batteryvoltage", "engineStatus", "controlmessages", "detail"];

  spinnerActive = true;

  ngOnInit(): void {
    this.socket.fromEvent('carList').pipe(map((data) => data), tap((data) => console.log(data))).subscribe((data: any) => {
      this.spinnerActive = false;
      this.dataSource = data;
    })
    this.socket.emit('carList');
  }



  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
  }

  navigateToCarDetails(vin: string) {
    this.router.navigate(['pages/car/' + vin]);
  }
}
