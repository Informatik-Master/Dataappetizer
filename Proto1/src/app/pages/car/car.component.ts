import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { EChartsOption } from 'echarts'
import { Subscription } from 'rxjs'
import { DataPointService } from '../../@core/data-point.service'
import { bufferTime, filter, map, tap, timestamp } from 'rxjs/operators'

class CarListEntry {
  vin?: string
  mileage?: string
  fuellevel?: string
  batteryvoltage?: string
  enginestatus?: string
  controlmessages?: []
  timestamp: number = 0
  lastupdated?: string
}

@Component({
  selector: 'ngx-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})

export class CarComponent implements OnInit {
  private subscription: Subscription | null = null

  constructor( private readonly dataPointService: DataPointService, private readonly router: Router
  ) { }

  dataSource: any

  displayedColumns = ["vin", "mileage", "fuellevel", "enginestatus", "controlmessages", "lastupdated"]

  carMap: CarListEntry[] = new Array<CarListEntry>()

  spinnerActive = true

  ngOnInit(): void {
    this.startTimeCounter()
    this.dataPointService.dataPoint$
    .pipe(
      filter(({event}) => event === "mileage" || event === "fuellevel" || event === "enginestatus"),
      bufferTime(1000)
    )
    .subscribe((bufferedEvents) => {
      this.spinnerActive = false
      for (const element of bufferedEvents) {
        let entry: CarListEntry = {
          timestamp: 0,
          lastupdated: "gerade eben"
        }
        let existEntry = this.carMap.find(({ vin }) => vin === element.data.vin)
        if(!existEntry){
          entry.vin = element.data.vin
          if(element.event == "mileage"){
            entry.mileage = element.data.value.value.value
          }
          if(element.event == "fuellevel"){
            entry.fuellevel = Math.round(element.data.value.value.value).toString()
          }
          if(element.event == "enginestatus"){
            entry.enginestatus = element.data.value.value.value
          }
          this.carMap.push(entry)
        }
        else {
          existEntry.timestamp = 0
          existEntry.lastupdated = "gerade eben"
          if(element.event == "mileage"){
            existEntry.mileage = element.data.value.value.value
          }
          if(element.event == "fuellevel"){
            existEntry.fuellevel = Math.round(element.data.value.value.value).toString()
          }
          if(element.event == "enginestatus"){
            existEntry.enginestatus = element.data.value.value.value
          }
        }
      }
      this.dataSource = this.carMap
    })
  }

  startTimeCounter() {
    setInterval(() => {
      this.carMap.forEach(function (entry){
        entry.timestamp += 1;
        entry.lastupdated = "vor "+entry.timestamp+" Min."
      })
    }, 60000);
  }

  onRowClicked(row: any) {
    console.log('Row clicked: ', row)
  }

  navigateToCarDetails(vin: string) {
    this.router.navigate(['pages/car/' + vin])
  }
}
