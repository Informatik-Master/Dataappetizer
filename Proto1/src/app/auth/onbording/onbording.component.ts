import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-onbording',
  templateUrl: './onbording.component.html',
  styleUrls: ['./onbording.component.scss'],
})
export class OnbordingComponent {
  selectedIndex = 1;

  constructor(private readonly router: Router) {}

  nextStep() {
    this.selectedIndex++;
  }

  finish() {
    this.router.navigate(['pages']);
  }
}
