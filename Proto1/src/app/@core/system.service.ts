import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { CookieService } from 'ngx-cookie';
import { Observable, ReplaySubject, firstValueFrom } from 'rxjs';
import { DataPointService } from './data-point.service';

export interface System {
  id?: string;
  name: string;
  users: string[];
  dashboardConfig: string[]; //TODO: später kein id-string mehr?
  detailConfig: string[];
  subscriptionId: string;
  secret?: string;
}
@Injectable({
  providedIn: 'root',
})
export class SystemService {

  private readonly _currentSystem = new ReplaySubject<System>(1);
  public readonly currentSystem = this._currentSystem.asObservable();

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: NbAuthService,

    private readonly dataPointService: DataPointService,
    private readonly cookieService: CookieService,
  ) {}

  public getSystems() {
    return this.httpClient.get<System[]>('/api/systems');
  }

  public getSystem(id: string): Observable<System> {
    return this.httpClient.get<System>(`/api/systems/${id}`);
  }

  public async createSystem(system: System): Promise<System> {
    const currentUser = await firstValueFrom(this.authService.getToken());

    if (!system.users.includes(currentUser.getPayload().email))
      system.users.push(currentUser.getPayload().email);
    return firstValueFrom(this.httpClient.post<System>('/api/systems', system));
  }

  public async updateSystem(system: System): Promise<System> {
    const currentUser = await firstValueFrom(this.authService.getToken());

    if (!system.users.includes(currentUser.getPayload().email))
      system.users.push(currentUser.getPayload().email);
    return firstValueFrom(this.httpClient.put<System>('/api/systems', system)); // TODO: implement this in the backend
  }

  public setCurrentSystem(s: System) {
    console.log('setting', s.id)
    this.cookieService.put('systemId', s.id);
    this.dataPointService.connect();

    this._currentSystem.next(s)//TODO: logout

    // this.cookieService.remove('systemId');
    // this.dataPointService.disconnect();
  }
}
