import { Controller, Get, Post } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('car')
export class ApiController {
    constructor(private readonly apiService: ApiService) { }

    @Get()
    getCarsInformation() {
        return this.apiService.getCarsInformation();
    }

    @Post()
    getSingleCarDetailInformation(vin:String, dataItems: String[]){
        return this.apiService.getSingleCarDetailInformation(vin, dataItems);
    }
}
