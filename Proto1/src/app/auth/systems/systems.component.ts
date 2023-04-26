import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.scss'],
})
export class SystemsComponent {
  selectedIndex = 1;

  constructor(private readonly router: Router) {}

  systems = [
    {
      title: 'System 1',
    },
    // {
    //   title: 'System 2',
    // },
    // {
    //   title: 'System 3',
    // },
    // {
    //   title: 'System 4',
    // },
  ];

  createCustomerSystem() {
    this.router.navigate(['auth/config']);
  }

  selectSystem() {
    this.router.navigate(['pages']);
  }
}
