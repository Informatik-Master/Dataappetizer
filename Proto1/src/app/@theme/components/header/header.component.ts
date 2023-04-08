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

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  public constructor(
    private readonly router: Router
  ) {
  }

  navigateHome() {
    this.router.navigate(['pages']);
  }

  navigateToCars() {
    this.router.navigate(['pages/car']);
  }

  navigateToSettings() {
    this.router.navigate(['pages/settings']);
  }


}
