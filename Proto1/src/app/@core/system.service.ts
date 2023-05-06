import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  public constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: NbAuthService
  ) {}

  public getSystems() {
    return this.httpClient.get<{ id: string; name: string }[]>('/api/systems'); //TODO: prefix with environment variable
  }

  public async createSystem(
    systemName: string
  ): Promise<{ id: string; name: string }> {
    const currentUser = await firstValueFrom(this.authService.getToken());

    return firstValueFrom(
      this.httpClient.post<{ id: string; name: string }>('/api/systems', {
        name: systemName,
        users: [
          // TODO: use ids instead of emails
          currentUser.getPayload().email,
        ],
      })
    );
  }
}
