import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Data } from 'src/model/data';
import { Vehicles } from 'src/model/vehicles';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class ExtractorService {
  constructor(
    @InjectRepository(Data)
    private dataRepository: Repository<Data>,
    @InjectRepository(Vehicles)
    private vehiclesRepository: Repository<Vehicles>,
  ) {}

  // extractLatestData(data: any) {
  //   // console.log("extractLatestData");
  //   return data;
  // }

  async handleDashboardEvent(): Promise<any> {
    const dataPackage = [];
    const vehicles = await this.vehiclesRepository.find();
    const livetickerData = [];

    for (let i = 0; i < vehicles.length; i++) {
      const vehicleData = await this.dataRepository.find({
        where: {
          vin: Equal(vehicles[i].vin),
        },
      });
      livetickerData.push(vehicleData);
    }

    const averageDistanceData = [];
    for (let i = 0; i < vehicles.length; i++) {
      const vehicleData = await this.dataRepository.find({
        where: {
          vin: Equal(vehicles[i].vin),
          datapoint: Equal('averageDistance'),
        },
      });

      // if (vehicleData.length != 1) { //In case a car has different datasets for one datapoint
      //   vehicleData = this.extractLatestData(vehicleData);
      // }

      averageDistanceData.push({
        name: 'Fahrzeug: ' + vehicleData[0].vin,
        value: Number(vehicleData[0].value),
      });
    }

    const geolocationData = [];
    for (let i = 0; i < vehicles.length; i++) {
      const vehicleData = await this.dataRepository.find({
        where: {
          vin: Equal(vehicles[i].vin),
          datapoint: Equal('geolocation'),
        },
      });

      geolocationData.push({
        vin: vehicles[i].vin,
        geolocation: {
          latitude: Number(vehicleData[0].value),
          longitude: Number(vehicleData[0].secondValue),
        },
      });
    }

    dataPackage.push({
      vehicles: vehicles,
      livetickerData: livetickerData,
      averageDistanceData: averageDistanceData,
      geolocationData: geolocationData,
    });

    return {
      event: 'overview',
      data: dataPackage,
    };
  }

  async handleCarListEvent(): Promise<any> {
    const vehicles = await this.vehiclesRepository.find();
    const dataPackage = [];
    for (let i = 0; i < vehicles.length; i++) {
      const mileageData = await this.dataRepository.find({
        where: {
          vin: Equal(vehicles[i].vin),
          datapoint: Equal('mileage'),
        },
      });

      const batteryvoltageData = await this.dataRepository.find({
        where: {
          vin: Equal(vehicles[i].vin),
          datapoint: Equal('batteryvoltage'),
        },
      });

      const engineStatusData = await this.dataRepository.find({
        where: {
          vin: Equal(vehicles[i].vin),
          datapoint: Equal('engineStatus'),
        },
      });
      const engineStatus =
        engineStatusData[0].value == 'ON'
          ? 'Motor ist eingeschaltet.'
          : 'Motor ist ausgeschaltet.';

      const checkcontrolmessagesData = await this.dataRepository.find({
        where: {
          vin: Equal(vehicles[i].vin),
          datapoint: Equal('checkcontrolmessages'),
        },
      });

      let checkcontrolmessages = '-';
      const messages = checkcontrolmessagesData[0].value;
      if (messages.length != 0) {
        let message = '';
        for (let j = 0; j < messages.length; j++) {
          const messageJSON = messages[j];
          if (j == messages.length - 1) {
            message = message + messageJSON.message;
          } else {
            message = message + messageJSON.message + ', ';
          }
        }
        checkcontrolmessages = message;
      }

      dataPackage.push({
        vin: vehicles[i].vin,
        mileage: mileageData[0].value + ' ' + mileageData[0].unit,
        batteryvoltage:
          batteryvoltageData[0].value + ' ' + batteryvoltageData[0].unit,
        engineStatus: engineStatus,
        controlmessages: checkcontrolmessages,
      });
    }

    return {
      event: 'carList',
      data: dataPackage,
    };
  }
}
