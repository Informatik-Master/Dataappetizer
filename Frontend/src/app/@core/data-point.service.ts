import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { resettable } from './reset-replay-subject';
import { environment } from 'src/environments/environment';

interface DataPointEvent {
  event: string;
  data: {
    vin: string;
    value: any;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DataPointService {
  private socket?: ReconnectingWebSocket;

  private readonly dataPointSubject: Subject<DataPointEvent>;
  private readonly resetSubject: () => void;
  public readonly dataPoint$: Observable<DataPointEvent>;

  public constructor() {
    const { observable, reset, subject } = resettable(
      () => new ReplaySubject<DataPointEvent>()
    );
    this.dataPointSubject = subject;
    this.dataPoint$ = observable;
    this.resetSubject = reset;
  }

  /**
   * Sends the system id as cookie to the server.
   **/
  public connect() {
    this.disconnect();

    console.log('connecting');
    this.socket = new ReconnectingWebSocket(environment.webSocketUrl);
    this.socket.addEventListener('message', (event) => {
      const parsed = JSON.parse(event.data);
      if (Array.isArray(parsed)) {
        parsed.forEach((dataPointEvent) =>
          this.dataPointSubject.next(dataPointEvent)
        );
        return;
      }

      this.dataPointSubject.next(parsed);
    });
  }

  public disconnect() {
    console.log('disconnecting');
    this.socket?.close();
    this.socket = undefined;
    this.resetSubject();
  }
}
