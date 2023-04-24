import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';

import { ApiService } from './api/api.service';
import { firstValueFrom } from 'rxjs';
import { ApiController } from './api/api.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { Data } from './model/data';
import { Vehicles } from './model/vehicles';
import { Equal, Repository } from 'typeorm';
import { ExtractorService } from './extractor/extractor.service';
import {Socket, Server} from 'socket.io' 

@WebSocketGateway({ cors: true })
export class SocketGateway {

  constructor(private readonly apiService: ApiService,
    @InjectRepository(Data)
    private dataRepository: Repository<Data>,
    @InjectRepository(Vehicles)
    private vehiclesRepository: Repository<Vehicles>,
    private extractorService : ExtractorService,
  ) { }

  @WebSocketServer()
  server!: Server;

  private allConnect: Socket[] = [];

  async handleConnection(socket: Socket) {
    // console.log('socket.OPEN', socket.OPEN);
    this.allConnect.push(socket);
  }

  async pushToAllConnections(data: any) {
    this.allConnect.forEach(c => {
      c.emit('overviewData', data)
    })
  }

  @SubscribeMessage('overview')
  async handleDashboardEvent(): Promise<any> {
    return this.extractorService.handleDashboardEvent();
  }

  @SubscribeMessage('carList')
  async handleCarListEvent(): Promise<any> {
   return this.extractorService.handleCarListEvent();
  }
}
