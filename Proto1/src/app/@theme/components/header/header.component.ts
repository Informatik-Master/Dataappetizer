import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbMediaBreakpointsService,
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  navigateHome() {
    const systemId = this.route.snapshot.paramMap.get('systemId');
    this.router.navigate(['pages', systemId]);
  }

  navigateToCars() {
    const systemId = this.route.snapshot.paramMap.get('systemId');
    this.router.navigate(['pages', systemId, 'car']);
  }

  navigateToSettings() {
    const systemId = this.route.snapshot.paramMap.get('systemId');
    this.router.navigate(['pages', systemId, 'settings']);
  }
}
