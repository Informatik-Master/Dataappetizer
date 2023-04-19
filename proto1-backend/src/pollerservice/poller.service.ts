import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom, from, map } from 'rxjs';
import { CarService } from 'src/car/car.service';
import { Data } from 'src/model/data';
import { Vehicles } from 'src/model/vehicles';
import { Repository } from 'typeorm';

@Injectable()
export class PollerService {
    constructor(
        @InjectRepository(Data)
        private dataRepository: Repository<Data>,
        @InjectRepository(Vehicles)
        private vehiclesRepository: Repository<Vehicles>,
        private readonly carService: CarService
    ) { }

    async saveCars() {
        const data = await firstValueFrom(this.carService.getCarsInformation());
        for (let i = 0; i < data.length; i++) {
            let vehicles_DB = {
                vin: data[i].vin
            }
            this.vehiclesRepository.save(vehicles_DB);
        }
        console.log("VEHICLES SAVED IN DB");
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async pollFromCarusoAPI() {
        let vehicles = await this.vehiclesRepository.find();

        for (let i = 0; i < vehicles.length; i++) {
            const singleCarData = await firstValueFrom(this.carService.getSingleCarDetailInformation(vehicles[i].vin, ["batteryvoltage", "mileage", "geolocation", "averagedistance", "enginestatus"]));
            let response = singleCarData.inVehicleData[0].response;

            //batteryvoltage
            let batteryVoltage_value = response.batteryvoltage.dataPoint.value.toFixed(2);
            let batteryvoltage_unit = response.batteryvoltage.dataPoint.unit;
            let batteryvoltage_timeStamp = response.batteryvoltage.dataPoint.timestamp;

            let data_DB = {
                vin: vehicles[i].vin,
                datapoint: "batteryvoltage",
                timestamp: batteryvoltage_timeStamp,
                value: batteryVoltage_value + " " + batteryvoltage_unit,
                secondValue: ""
            };

            this.dataRepository.save(data_DB);

            //mileage
            let mileage_value = response.mileage.dataPoint.value;
            let mileage_unit = response.mileage.dataPoint.unit;
            let mileage_timeStamp = response.mileage.dataPoint.timestamp;

            data_DB = {
                vin: vehicles[i].vin,
                datapoint: "mileage",
                timestamp: mileage_timeStamp,
                value: "" + mileage_value + " " + mileage_unit,
                secondValue: ""
            };

            this.dataRepository.save(data_DB);

            //geolocation
            let geolocation_latitude = response.geolocation.dataPoint.latitude;
            let geolocation_longitude = response.geolocation.dataPoint.longitude;
            let geolocation_timeStamp = response.geolocation.dataPoint.timestamp;

            data_DB = {
                vin: vehicles[i].vin,
                datapoint: "geolocation",
                timestamp: geolocation_timeStamp,
                value: "" + geolocation_latitude,
                secondValue: "" + geolocation_longitude
            };

            this.dataRepository.save(data_DB);

            //averageDistance
            let averageDistance_value = response.averagedistance.dataPoint.value.toFixed(2);
            let averageDistance_unit = response.averagedistance.dataPoint.unit;
            let averageDistance_timeStamp = response.averagedistance.dataPoint.timestamp;

            data_DB = {
                vin: vehicles[i].vin,
                datapoint: "averageDistance",
                timestamp: averageDistance_timeStamp,
                value: "" + averageDistance_value + " " + averageDistance_unit,
                secondValue: ""
            };

            this.dataRepository.save(data_DB);

            //engineStatus
            let engineStatus_value = response.enginestatus.dataPoint.value;
            let engineStatus_timeStamp = response.enginestatus.dataPoint.timestamp;

            data_DB = {
                vin: vehicles[i].vin,
                datapoint: "engineStatus",
                timestamp: engineStatus_timeStamp,
                value: engineStatus_value,
                secondValue: ""
            };

            this.dataRepository.save(data_DB);
        }
        console.log("DATA SAVED IN DB!");
    }
}
