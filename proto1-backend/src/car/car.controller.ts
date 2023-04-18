import { Controller, Get, Post } from '@nestjs/common';
import { CarService } from './car.service';

@Controller('car')
export class CarController {
    constructor(private readonly singleVehicleService: CarService) { }

    @Get()
    getCarsInformation() {
        return this.singleVehicleService.getCarsInformation();
    }

    @Post()
    getSingleCarDetailInformation(vin:String, dataItems: String[]){
        return this.singleVehicleService.getSingleCarDetailInformation(vin, dataItems);
    }
}
