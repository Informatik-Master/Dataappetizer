import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { Observable, firstValueFrom } from 'rxjs';

interface System {
  id?: string;
  name: string;
  users: string[];
  dashboardConfig: string[]; //TODO: später kein id-string mehr?
  detailConfig: string[];
  subscriptionId: string;
}
@Injectable({
  providedIn: 'root',
})
export class SystemService {
  public constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: NbAuthService
  ) {}

  public getSystems() {
    return this.httpClient.get<System[]>('/api/systems');
  }

  public async createSystem(system: System): Promise<System> {
    const currentUser = await firstValueFrom(this.authService.getToken());

    if (!system.users.includes(currentUser.getPayload().email))
      system.users.push(currentUser.getPayload().email);
    return firstValueFrom(this.httpClient.post<System>('/api/systems', system));
  }
}
