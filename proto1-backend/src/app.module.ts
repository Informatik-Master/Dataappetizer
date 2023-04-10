import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket-gateway.service';
import { CarController } from './car/car.controller';
import { CarService } from './car/car.service';
import { CarModule } from './car/car.module';

@Module({
  imports: [CarModule],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
  // providers: [AppService],
})
export class AppModule {}
