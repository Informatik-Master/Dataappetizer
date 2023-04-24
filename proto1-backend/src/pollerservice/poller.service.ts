import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom, from, map } from 'rxjs';
import { ApiService } from 'src/api/api.service';
import { Data } from 'src/model/data';
import { Vehicles } from 'src/model/vehicles';
import { Repository } from 'typeorm';
import {SocketGateway} from '../socket-gateway.service'

@Injectable()
export class PollerService {
    constructor(
        @InjectRepository(Data)
        private dataRepository: Repository<Data>,
        @InjectRepository(Vehicles)
        private vehiclesRepository: Repository<Vehicles>,
        private readonly apiService: ApiService,
        private readonly socketGateway: SocketGateway        
    ) { }

    async saveCars() {
        const data = await firstValueFrom(this.apiService.getCarsInformation());
        for (let i = 0; i < data.length; i++) {
            let vehiclesDB = {
                vin: data[i].vin
            }
            this.vehiclesRepository.save(vehiclesDB);
        }
        console.log("VEHICLES SAVED IN DB");
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async pollFromCarusoAPI() {
        let vehicles = await this.vehiclesRepository.find();

        for (let i = 0; i < vehicles.length; i++) {
            const singleCarData = await firstValueFrom(this.apiService.getSingleCarDetailInformation(vehicles[i].vin, ["batteryvoltage", "mileage", "geolocation", "averagedistance", "enginestatus", "checkcontrolmessages"]));
            let response = singleCarData.inVehicleData[0].response;

            //batteryvoltage
            let batteryvoltage_value = response.batteryvoltage.dataPoint.value.toFixed(2);
            let batteryvoltage_unit = response.batteryvoltage.dataPoint.unit;
            let batteryvoltage_timestamp = response.batteryvoltage.dataPoint.timestamp;

            let dataDB = {
                vin: vehicles[i].vin,
                datapoint: "batteryvoltage",
                timestamp: batteryvoltage_timestamp,
                value: batteryvoltage_value,
                unit: batteryvoltage_unit,
                secondValue: ""
            };

            this.dataRepository.save(dataDB);

            //mileage
            let mileage_value = response.mileage.dataPoint.value;
            let mileage_unit = response.mileage.dataPoint.unit;
            let mileage_timestamp = response.mileage.dataPoint.timestamp;

            dataDB = {
                vin: vehicles[i].vin,
                datapoint: "mileage",
                timestamp: mileage_timestamp,
                value: "" + mileage_value,
                unit: mileage_unit,
                secondValue: ""
            };

            this.dataRepository.save(dataDB);

            //geolocation
            let geolocation_latitude = response.geolocation.dataPoint.latitude;
            let geolocation_longitude = response.geolocation.dataPoint.longitude;
            let geolocation_timestamp = response.geolocation.dataPoint.timestamp;

            dataDB = {
                vin: vehicles[i].vin,
                datapoint: "geolocation",
                timestamp: geolocation_timestamp,
                value: "" + geolocation_latitude,
                unit: "",
                secondValue: "" + geolocation_longitude
            };

            this.dataRepository.save(dataDB);

            //averagedistance
            let averagedistance_value = response.averagedistance.dataPoint.value.toFixed(2);
            let averagedistance_unit = response.averagedistance.dataPoint.unit;
            let averagedistance_timestamp = response.averagedistance.dataPoint.timestamp;

            dataDB = {
                vin: vehicles[i].vin,
                datapoint: "averageDistance",
                timestamp: averagedistance_timestamp,
                value: "" + averagedistance_value,
                unit: averagedistance_unit,
                secondValue: ""
            };

            this.dataRepository.save(dataDB);

            //enginestatus
            let enginestatus_value = response.enginestatus.dataPoint.value;
            let enginestatus_timestamp = response.enginestatus.dataPoint.timestamp;

            dataDB = {
                vin: vehicles[i].vin,
                datapoint: "engineStatus",
                timestamp: enginestatus_timestamp,
                value: enginestatus_value,
                unit: "",
                secondValue: ""
            };

            this.dataRepository.save(dataDB);

            //checkcontrolmessages
            let checkcontrolmessages_value = response.checkcontrolmessages.dataPoint.value;
            let checkcontrolmessages_timestamp = response.checkcontrolmessages.dataPoint.timestamp;

            dataDB = {
                vin: vehicles[i].vin,
                datapoint: "checkcontrolmessages",
                timestamp: checkcontrolmessages_timestamp,
                value: checkcontrolmessages_value,
                unit: "",
                secondValue: ""
            };

            this.dataRepository.save(dataDB);
        }
        console.log("DATA SAVED IN DB!");
    }
}
