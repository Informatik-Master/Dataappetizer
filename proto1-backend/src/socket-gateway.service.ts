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
    let carData = [];
    for (let i = 0; i < data.length; i++) {
      const singleCarData = await firstValueFrom(carController.getSingleCarDetailInformation(data[i].vin, ["averagedistance"]));
      let averageDistance = singleCarData.inVehicleData[0].response.averagedistance.dataPoint.value.toFixed(0);
      carData.push({
        value: averageDistance,
        name: "Fahrzeug: " + data[i].vin
      })
    }
    return {
      event: 'getDiagram',
      data: carData
    };
  }

  @SubscribeMessage('carList')
  async handleCarListEvent(): Promise<any> {
    let carController = new CarController(this.carService);
    const data = await firstValueFrom(carController.getCarsInformation());
    let carData = [];
    for (let i = 0; i < data.length; i++) {
      const singleCarData = await firstValueFrom(carController.getSingleCarDetailInformation(data[i].vin, ["averagedistance", "batteryvoltage", "enginestatus"]));
      let averageDistance = singleCarData.inVehicleData[0].response.averagedistance.dataPoint.value.toFixed(2);
      let averageDistanceUnit = singleCarData.inVehicleData[0].response.averagedistance.dataPoint.unit;
      let enginestatusTemp = singleCarData.inVehicleData[0].response.enginestatus.dataPoint.value;
      let batteryvoltage = singleCarData.inVehicleData[0].response.batteryvoltage.dataPoint.value.toFixed(2);
      let batteryvoltageUnit = singleCarData.inVehicleData[0].response.batteryvoltage.dataPoint.unit;
      let enginestatus = enginestatusTemp == "ON" ? "Motor ist eingeschaltet." : "Motor ist ausgeschaltet.";

      carData.push({
        vin: data[i].vin,
        kilometer: averageDistance + " " + averageDistanceUnit,
        fuel: batteryvoltage + " " + batteryvoltageUnit,
        status: enginestatus
      });
    }
    return {
      event: 'carList',
      data: carData
    }
  }
}
