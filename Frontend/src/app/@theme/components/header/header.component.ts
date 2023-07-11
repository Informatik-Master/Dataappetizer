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
import { NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  items: NbMenuItem[] = [
    { title: 'Switch system', icon: 'flip-2-outline', link: '/auth/systems' },
    { title: 'Logout', icon: 'log-out-outline',  link:'/auth/login'}, // TODO: logout
  ];

  public constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    readonly nbAuth: NbAuthService
  ) {}

  navigateHome() {
    const systemId = this.route.snapshot.paramMap.get('systemId');
    this.router.navigate(['pages', systemId]);
    this.nbAuth.getToken().subscribe((token) => {
      token.getPayload().email
    })
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
