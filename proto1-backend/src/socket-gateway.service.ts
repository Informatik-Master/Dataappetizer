import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'ws';

const BASE_DIAGRAMM = {
  legend: {
    top: 'bottom',
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8,
      },
      data: [
        { value: 4, name: 'VW' },
        { value: 3, name: 'BMW' },
        { value: 3, name: 'SEAT' },
        { value: 5, name: 'AUDI' },
        { value: 2, name: 'FORD' },
        { value: 3, name: 'OPEL' },
        { value: 1, name: 'PORSCHE' },
      ],
    },
  ],
};

@WebSocketGateway({ cors: true })
export class SocketGateway {
  @WebSocketServer()
  server!: Server;

  async handleConnection(socket: WebSocket) {
    console.dir(socket);
    console.log('socket.OPEN', socket.OPEN);
  }

  @SubscribeMessage('getDiagram')
  handleEvent(): any {
    console.log('getDiagram');
    const newDiagram = JSON.parse(JSON.stringify(BASE_DIAGRAMM));

    newDiagram.series[0].data = newDiagram.series[0].data.map((item: any) => {
      item.value = Math.floor(Math.random() * 10);
      return item;
    });
    // return { event: 'getDiagram', data: newDiagram };
    return {
      event: 'getDiagram',
      data: [
        { value: 4, name: 'VW' },
        { value: 3, name: 'BMW' },
        { value: 3, name: 'SEAT' },
        { value: 5, name: 'AUDI' },
        { value: 2, name: 'FORD' },
        { value: 3, name: 'OPEL' },
        { value: 1, name: 'PORSCHE' },
      ].map((item: any) => {
        item.value = Math.floor(Math.random() * 10);
        return item;
      }),
    };
  }
}
