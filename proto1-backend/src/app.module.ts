import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket-gateway.service';
import { CarController } from './car/car.controller';
import { CarService } from './car/car.service';
import { CarModule } from './car/car.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [CarModule],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
