import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { DataPointService } from '../../@core/data-point.service'
import { bufferTime, filter, map, tap, timestamp } from 'rxjs/operators'

class CarListEntry {
  vin?: string
  mileage?: string
  fuellevel?: string
  batteryvoltage?: string
  enginestatus?: string
  controlmessages?: String[]= new Array<String>()
  icon?: string = "loader-outline"
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

  displayedColumns = ["vin", "mileage", "fuellevel", "enginestatus", "icon", "lastupdated"]

  carMap: CarListEntry[] = new Array<CarListEntry>()

  spinnerActive = true

  hoverMessage: String[]= new Array<String>()

  datapoints = ["mileage","fuellevel","enginestatus","checkcontrolmessages"]

  ngOnInit(): void {
    setInterval(() => {
      this.carMap.forEach(function (entry){
        entry.timestamp += 1;
        entry.lastupdated = "vor "+entry.timestamp+" Min."
      })
    }, 60000);
    this.dataPointService.dataPoint$
    .pipe(
      filter(({event}) => this.datapoints.includes(event)),
      bufferTime(1000)
    )
    .subscribe((bufferedEvents) => {
      this.spinnerActive = false
      for (const element of bufferedEvents) {
        let entry: CarListEntry = {
          timestamp: 0,
          icon: "loader-outline",
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
          if(element.event == "checkcontrolmessages"){
            let messages = element.data.value.value.value
            messages?.forEach( (entry: any) => {
              this.hoverMessage.push(entry.status)
            })
          }
          else {
            entry.icon = "checkmark-outline"
          }
          this.carMap.push(entry)
        }
        else {
          existEntry.timestamp = 0
          existEntry.icon= "loader-outline"
          existEntry.lastupdated = "gerade eben"
          existEntry.controlmessages = []
          if(element.event == "mileage"){
            existEntry.mileage = element.data.value.value.value
          }
          if(element.event == "fuellevel"){
            existEntry.fuellevel = Math.round(element.data.value.value.value).toString()
          }
          if(element.event == "enginestatus"){
            existEntry.enginestatus = element.data.value.value.value
          }
          if(element.event == "checkcontrolmessages"){
            let messages = element.data.value.value.value
            messages.forEach((entry: any) => { 
              this.hoverMessage.push(entry.status + entry.message)
            })
            existEntry.controlmessages = this.hoverMessage
          }
          else {
            existEntry.icon = "checkmark-outline"
          }
        }
      }
      this.dataSource = this.carMap
    })
  }

  onRowClicked(row: any) {
    console.log('Row clicked: ', row)
  }

  navigateToCarDetails(vin: string) {
    this.router.navigate(['pages/car/' + vin])
  }
}
