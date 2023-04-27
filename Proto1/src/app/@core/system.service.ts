import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SystemService {

  public constructor(private readonly httpClient: HttpClient) { }

  public getSystems() {
    return this.httpClient.get<({id: string, name: string})[]>('/api/systems'); //TODO: prefix with environment variable
  }

  public createSystem(systemName: string): Observable<{id: string, name: string}> {
    return this.httpClient.post<{id: string, name: string}>('/api/systems', {name: systemName});
  }
}
