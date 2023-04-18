import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Data } from 'src/model/data';
import { DatabaseController } from './database.controller';
import { CarService } from 'src/car/car.service';
import { HttpModule } from '@nestjs/axios';
import { CarModule } from 'src/car/car.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([Data]),
        HttpModule
    ],
    providers:[
        DatabaseService,
        CarService,
    ],
    controllers:[
        DatabaseController
    ]
})
export class DatabaseModule {}