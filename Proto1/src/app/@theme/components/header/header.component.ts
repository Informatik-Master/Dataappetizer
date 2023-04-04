import { Component, OnDestroy, OnInit } from '@angular/core';
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
    private readonly menuService: NbMenuService,
  ) {
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

}
