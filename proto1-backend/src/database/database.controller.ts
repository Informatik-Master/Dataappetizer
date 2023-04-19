import { Controller, Get, Post } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { stringify } from 'querystring';
import { Data } from 'src/model/data';
import { Observable } from 'rxjs';

@Controller('database')
export class DatabaseController {
    constructor(private databaseService: DatabaseService){}

    @Post()
    create(){
        this.databaseService.insertNewFuelLevelData();
    }

    @Get()
    read():Observable<Data[]>{
        return this.databaseService.readFuelLevelData();
    }
}