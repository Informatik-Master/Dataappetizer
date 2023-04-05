import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent {
  selectedIndex = 1;

  constructor(private readonly router: Router) {}


  finish() {
    this.router.navigate(['pages']);
  }
}
