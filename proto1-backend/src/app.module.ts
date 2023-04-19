import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket-gateway.service';
import { CarController } from './car/car.controller';
import { CarService } from './car/car.service';
import { CarModule } from './car/car.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseController } from './database/database.controller';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { PollerService } from './pollerservice/poller.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Data } from './model/data';
import { Vehicles } from './model/vehicles';

@Module({
  imports: [CarModule, 
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forFeature([Data]),
    TypeOrmModule.forFeature([Vehicles]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    DatabaseModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway, PollerService],
})
export class AppModule {}