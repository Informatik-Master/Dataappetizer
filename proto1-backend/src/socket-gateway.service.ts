import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'ws';
import { CarService } from './car/car.service';
import { firstValueFrom } from 'rxjs';
import { CarController } from './car/car.controller';

const BASE_DIAGRAMM = {
  legend: {
    top: 'bottom',
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
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

@WebSocketGateway({ cors: true })
export class SocketGateway {

  constructor(private readonly carService: CarService) { }

  @WebSocketServer()
  server!: Server;

  async handleConnection(socket: WebSocket) {
    console.dir(socket);
    console.log('socket.OPEN', socket.OPEN);
  }

  @SubscribeMessage('getDiagram')
  async handleDashboardEvent(): Promise<any> {
    let carController = new CarController(this.carService);
    const data = await firstValueFrom(carController.getCarsInformation());

    return {
      event: 'getDiagram',
      data: [
        { value: 2, name: data[0].vin },
        { value: 3, name: data[1].vin },
        { value: 1, name: data[2].vin },
        { value: 4, name: data[3].vin }
      ]
    };
  }

  @SubscribeMessage('carList')
  async handleCarListEvent(): Promise<any> {

    let carController = new CarController(this.carService);
    const data = await firstValueFrom(carController.getCarsInformation());
    const singleCarData = await firstValueFrom(carController.getSingleCarDetailInformation());
    
    let averageDistance = singleCarData.inVehicleData[0].response.averagedistance.dataPoint.value.toFixed(2);
    let averageDistanceUnit = singleCarData.inVehicleData[0].response.averagedistance.dataPoint.unit;
    let enginestatusTemp = singleCarData.inVehicleData[0].response.enginestatus.dataPoint.value;
    let batteryvoltage = singleCarData.inVehicleData[0].response.batteryvoltage.dataPoint.value.toFixed(2);
    let batteryvoltageUnit = singleCarData.inVehicleData[0].response.batteryvoltage.dataPoint.unit;

    console.log("ENGINESTATUS:" + enginestatusTemp);
    let enginestatus = enginestatusTemp == "ON" ? "Engine is ON.":"Engine is OFF.";

    return {
      event: 'carList',
      data: [
        {
          vin: data[0].vin,
          kilometer: averageDistance + " " + averageDistanceUnit,
          fuel: batteryvoltage + " " + batteryvoltageUnit,
          status: enginestatus
        },
        {
          vin: data[1].vin,
          kilometer: averageDistance + " " + averageDistanceUnit,
          fuel: batteryvoltage + " " + batteryvoltageUnit,
          status: enginestatus
        },
        {
          vin: data[2].vin,
          kilometer: averageDistance + " " + averageDistanceUnit,
          fuel: batteryvoltage + " " + batteryvoltageUnit,
          status: enginestatus
        },
        {
          vin: data[3].vin,
          kilometer: averageDistance + " " + averageDistanceUnit,
          fuel: batteryvoltage + " " + batteryvoltageUnit,
          status: enginestatus
        },
      ]
    }
  }

}
