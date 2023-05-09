import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SystemService } from '../../@core/system.service';

@Component({
  selector: 'ngx-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.scss'],
})
export class SystemsComponent {
  selectedIndex = 1;

  constructor(
    private readonly router: Router,
    private readonly systemService: SystemService
  ) {}

  systems = this.systemService.getSystems();

  createCustomerSystem() {
    this.router.navigate(['auth/config']);
  }

  selectSystem(systemId: string) {
    this.router.navigate(['pages', systemId], {
      state: {
        woop: systemId
      }
    });
  }
}
