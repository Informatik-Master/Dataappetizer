import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket-gateway.service';
import { ApiController } from './api/api.controller';
import { ApiService } from './api/api.service';
import { ApiModule } from './api/api.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PollerService } from './pollerservice/poller.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Data } from './model/data';
import { Vehicles } from './model/vehicles';

@Module({
  imports: [ApiModule, 
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
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway, PollerService],
})
export class AppModule {}