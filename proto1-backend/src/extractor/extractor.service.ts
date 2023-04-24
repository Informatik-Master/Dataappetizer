import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Data } from 'src/model/data';
import { Vehicles } from 'src/model/vehicles';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class ExtractorService {
    constructor(@InjectRepository(Data)
        private dataRepository: Repository<Data>,
        @InjectRepository(Vehicles)
        private vehiclesRepository: Repository<Vehicles>,
      ) { }

 // extractLatestData(data: any) {
  //   // console.log("extractLatestData");
  //   return data;
  // }

    async handleDashboardEvent(): Promise<any>{
        let dataPackage = [];
        let vehicles = await this.vehiclesRepository.find();
        let livetickerData = []
    
        for (let i = 0; i < vehicles.length; i++) {
          let vehicleData = await this.dataRepository.find({
            where: {
              vin: Equal(vehicles[i].vin),
            },
          });
          livetickerData.push(vehicleData);
        }
    
        let averageDistanceData = [];
        for (let i = 0; i < vehicles.length; i++) {
          let vehicleData = await this.dataRepository.find({
            where: {
              vin: Equal(vehicles[i].vin),
              datapoint: Equal("averageDistance")
            },
          });
    
          // if (vehicleData.length != 1) { //In case a car has different datasets for one datapoint
          //   vehicleData = this.extractLatestData(vehicleData);
          // }
    
          averageDistanceData.push({
            name: "Fahrzeug: " + vehicleData[0].vin,
            value: Number(vehicleData[0].value)
          });
        }
    
        let geolocationData = [];
        for (let i = 0; i < vehicles.length; i++) {
          let vehicleData = await this.dataRepository.find({
            where: {
              vin: Equal(vehicles[i].vin),
              datapoint: Equal("geolocation")
            },
          });
    
          geolocationData.push({
            vin: vehicles[i].vin,
            geolocation: {
              latitude: Number(vehicleData[0].value),
              longitude: Number(vehicleData[0].secondValue)
            }
          })
        }
    
        dataPackage.push({
          vehicles: vehicles,
          livetickerData: livetickerData,
          averageDistanceData: averageDistanceData,
          geolocationData: geolocationData
        });
    
        return {
          event: 'overview',
          data: dataPackage
        };
    }

    async handleCarListEvent(): Promise<any>{
        let vehicles = await this.vehiclesRepository.find();
        let dataPackage = [];
        for (let i = 0; i < vehicles.length; i++) {
          let mileageData = await this.dataRepository.find({
            where: {
              vin: Equal(vehicles[i].vin),
              datapoint: Equal("mileage"),
            },
          });
    
          let batteryvoltageData = await this.dataRepository.find({
            where: {
              vin: Equal(vehicles[i].vin),
              datapoint: Equal("batteryvoltage"),
            },
          });
    
          let engineStatusData = await this.dataRepository.find({
            where: {
              vin: Equal(vehicles[i].vin),
              datapoint: Equal("engineStatus"),
            },
          });
          let engineStatus = engineStatusData[0].value == "ON" ? "Motor ist eingeschaltet." : "Motor ist ausgeschaltet.";
    
          let checkcontrolmessagesData = await this.dataRepository.find({
            where: {
              vin: Equal(vehicles[i].vin),
              datapoint: Equal("checkcontrolmessages"),
            },
          });
    
          let checkcontrolmessages = "-";
          let messages = checkcontrolmessagesData[0].value;
          if(messages.length != 0){
            let message = "";
            for(let j = 0; j < messages.length; j++){
              let messageJSON = messages[j];
              if(j == messages.length-1){
                message = message + messageJSON.message;
              }else{
                message = message + messageJSON.message + ", ";
              }
            }
            checkcontrolmessages = message;
          }
    
          dataPackage.push({
            vin: vehicles[i].vin,
            mileage: mileageData[0].value + " " + mileageData[0].unit,
            batteryvoltage: batteryvoltageData[0].value + " " + batteryvoltageData[0].unit,
            engineStatus: engineStatus,
            controlmessages: checkcontrolmessages
          });
        }
    
        return {
          event: 'carList',
          data: dataPackage
        }
    }
}
