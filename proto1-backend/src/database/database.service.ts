import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarService } from 'src/car/car.service';
import { Data } from 'src/model/data';
import { Repository } from 'typeorm';
import { Observable, firstValueFrom, from } from 'rxjs';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectRepository(Data)
        private fuelLevelRepository: Repository<Data>,
        private readonly carService: CarService
    ) { }

    async insertNewFuelLevelData() {
        const data = await firstValueFrom(this.carService.getCarsInformation());
        for (let i = 0; i < data.length; i++) {
            const singleCarData = await firstValueFrom(this.carService.getSingleCarDetailInformation(data[i].vin, ["batteryvoltage"]));
            let timeStamp = singleCarData.inVehicleData[0].response.batteryvoltage.dataPoint.timestamp;
            let batteryvoltage = singleCarData.inVehicleData[0].response.batteryvoltage.dataPoint.value.toFixed(0);
            let batteryvoltageUnit = singleCarData.inVehicleData[0].response.batteryvoltage.dataPoint.unit;
            let fuelLevel = {
                vin: data[i].vin,
                timeStamp: timeStamp,
                value: batteryvoltage
            };
            this.fuelLevelRepository.save(fuelLevel);
        }
    }

    readFuelLevelData(): Observable<Data[]> {
        return from(this.fuelLevelRepository.find());
    }
}