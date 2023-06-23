import { Component } from '@angular/core';
import { DataPointService } from '../@core/data-point.service';
import { CookieService } from 'ngx-cookie';
import { ActivatedRoute } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { SystemService } from '../@core/system.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <main-layout>
      <router-outlet></router-outlet>
    </main-layout>
  `,
})
export class PagesComponent {

  paramSubscription : Subscription | null = null;

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly systemService: SystemService
  ) {}

  ngOnInit(): void {
    this.paramSubscription = this.activeRoute.paramMap.subscribe(async params => {
      const systemId = params.get('systemId');
      const newSystem = await firstValueFrom(this.systemService.getSystem(systemId!))
      this.systemService.setCurrentSystem(newSystem);
    });

  }

  ngOnDestroy(): void {
    this.systemService.setCurrentSystem(null);
    this.paramSubscription?.unsubscribe();
  }
}
