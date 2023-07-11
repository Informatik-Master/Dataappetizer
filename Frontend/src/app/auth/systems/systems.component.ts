import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { System, SystemService } from '../../@core/system.service';
import { tap } from 'rxjs';

@Component({
  selector: 'ngx-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.scss'],
})
export class SystemsComponent {
  selectedIndex = 1;
  loaded = false;

  constructor(
    private readonly router: Router,
    private readonly systemService: SystemService
  ) {}

  systems = this.systemService
    .getSystems()
    .pipe(tap((_) => (this.loaded = true)));

  createCustomerSystem() {
    this.router.navigate(['auth/config']);
  }

  selectSystem(system: System) {
    this.systemService.setCurrentSystem(system);
    this.router.navigate(['pages', system.id], {
      state: {
        system,
      },
    });
  }
}
