import { Component } from '@angular/core';
import { DataPointService } from '../@core/data-point.service';
import { CookieService } from 'ngx-cookie';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private readonly dataPointService: DataPointService,
    private readonly cookieService: CookieService,
    private readonly activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const systemId = this.activeRoute.snapshot.paramMap.get('systemId')!;
    console.log('init', systemId);
    this.cookieService.put('systemId', systemId); // TODO: create auth service? Also the whole login is missing :D
    this.dataPointService.connect(); // TODO: Is this better per dashboard?
  }

  ngOnDestroy(): void {
    console.log('destroying');
    this.cookieService.remove('systemId');
    this.dataPointService.disconnect();
  }
}
