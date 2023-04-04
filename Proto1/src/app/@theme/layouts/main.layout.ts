import { Component } from '@angular/core';

@Component({
  selector: 'main-layout',
  styleUrls: ['./main.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed class="navbaroben">
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        Mit ❤️ in Mannheim gemacht
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class MainLayoutComponent {}
