import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { CarService } from 'src/car/car.service';
import { Data } from 'src/model/data';
import { Repository } from 'typeorm';

@Injectable()
export class PollerService {
    constructor(
        @InjectRepository(Data)
        private fuelLevelRepository: Repository<Data>,
        private readonly carService: CarService
    ) {}

    @Cron(CronExpression.EVERY_5_MINUTES)
    async pollFromCarusoAPI(){
        const data = await firstValueFrom(this.carService.getCarsInformation());
        
        for (let i = 0; i < data.length; i++) {
            const singleCarData = await firstValueFrom(this.carService.getSingleCarDetailInformation(data[i].vin, ["batteryvoltage", "mileage", "geolocation", "averageDistance", "engineStatus"]));
            let response = singleCarData.inVehicleData[0].response;

            //batteryvoltage
            let batteryVoltage_value = response.batteryvoltage.dataPoint.value.toFixed(2);
            let batteryvoltage_unit = response.batteryvoltage.dataPoint.unit;
            let batteryvoltage_timeStamp = response.batteryvoltage.dataPoint.timestamp;

            let data_DB = {
                vin: data[i].vin,
                datapoint: "batteryvoltage",
                timestamp: batteryvoltage_timeStamp,
                value: "" + batteryVoltage_value + " " + batteryvoltage_unit,
                secondValue: ""
            };

            this.fuelLevelRepository.save(data_DB);

            //mileage
            let mileage_value = response.mileage.dataPoint.value;
            let mileage_unit = response.mileage.dataPoint.unit;
            let mileage_timeStamp = response.mileage.dataPoint.timestamp;

            data_DB = {
                vin: data[i].vin,
                datapoint: "mileage",
                timestamp: mileage_timeStamp,
                value: "" + mileage_value + " " + mileage_unit,
                secondValue: ""
            };

            this.fuelLevelRepository.save(data_DB);

            //geolocation
            let geolocation_latitude = response.averageDistance.dataPoint.latitude;
            let geolocation_longitude = response.averageDistance.dataPoint.longitude;
            let geolocation_timeStamp = response.geolocation.dataPoint.timestamp;

            data_DB = {
                vin: data[i].vin,
                datapoint: "geolocation",
                timestamp: geolocation_timeStamp,
                value: "" + geolocation_latitude,
                secondValue: "" + geolocation_longitude
            };

            this.fuelLevelRepository.save(data_DB);

            //averageDistance
            let averageDistance_value = response.averageDistance.dataPoint.value.toFixed(2);
            let averageDistance_unit = response.averageDistance.dataPoint.unit;
            let averageDistance_timeStamp = response.averageDistance.dataPoint.timestamp;

            data_DB = {
                vin: data[i].vin,
                datapoint: "averageDistance",
                timestamp: averageDistance_timeStamp,
                value: "" + averageDistance_value + " " +averageDistance_unit,
                secondValue: ""
            };

            this.fuelLevelRepository.save(data_DB);

            //engineStatus
            let engineStatus_value = response.engineStatus.dataPoint.value;
            let engineStatus_timeStamp = response.engineStatus.dataPoint.timestamp;

            data_DB = {
                vin: data[i].vin,
                datapoint: "engineStatus",
                timestamp: engineStatus_timeStamp,
                value: engineStatus_value,
                secondValue: ""
            };

            this.fuelLevelRepository.save(data_DB);
        }
    }
}
