import { Component } from '@angular/core';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <main-layout>
      <router-outlet></router-outlet>
    </main-layout>
  `,
})
export class PagesComponent {
}
