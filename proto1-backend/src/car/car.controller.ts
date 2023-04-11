import { Controller, Get, Post } from '@nestjs/common';
import { CarService } from './car.service';

@Controller('car')
export class CarController {
    constructor(private readonly singleVehicleService: CarService) { }

    @Get()
    getVehicleInformation() {
        return this.singleVehicleService.getVehicleInformation();
    }
}
