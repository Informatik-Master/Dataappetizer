import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent {
  selectedIndex = 0;

  organization = 0;

  systemName = 'System Name';

  constructor(private readonly router: Router) {}

  previous() {
    this.selectedIndex--;
  }

  next() {
    this.selectedIndex++;
  }

  finish() {
    this.router.navigate(['pages']);
  }
}
