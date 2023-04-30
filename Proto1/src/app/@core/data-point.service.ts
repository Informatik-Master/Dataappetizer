import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import ReconnectingWebSocket from 'reconnecting-websocket';

@Injectable({
  providedIn: 'root',
})
export class DataPointService {
  private socket?: ReconnectingWebSocket;

  private readonly dataPointSubject = new Subject<any>();
  public readonly dataPoint$ = this.dataPointSubject.asObservable();

  /**
   * Sends the system id as cookie to the server.
   **/
  public connect() {
    this.disconnect();

    console.log('connecting');
    this.socket = new ReconnectingWebSocket('ws://localhost:3001');
    this.socket.addEventListener('message', (event) => {
      this.dataPointSubject.next(JSON.parse(event.data));
    });
  }

  public disconnect() {
    console.log('disconnecting');
    this.socket?.close();
    this.socket = undefined;
  }
}
