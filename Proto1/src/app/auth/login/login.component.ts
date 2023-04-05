import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'nb-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  user: any = {};
  submitted = false;

  constructor(
    protected readonly router: Router,
   ) {
   }

  login() {
    this.router.navigate(['pages']);
  }

}
