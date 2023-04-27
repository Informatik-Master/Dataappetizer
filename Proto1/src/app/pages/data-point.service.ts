import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Observable } from 'rxjs';
import { PagesModule } from './pages.module';

export interface DataPointMessage {
  eventName: string;
}

@Injectable({
  providedIn: PagesModule,
})
export class DataPointService {

  readonly socket = new ReconnectingWebSocket('ws://localhost:3001'); // TODO: Config

  public constructor() {

  }

  private onMessage(event: MessageEvent<any>) {

  }

}
