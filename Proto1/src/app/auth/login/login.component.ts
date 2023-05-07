import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { firstValueFrom } from 'rxjs';

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
    protected readonly nbAuth: NbAuthService
  ) {}

  async login() {
    console.log('woop');
    this.nbAuth.authenticate('email', this.user).subscribe((authResult) => {
      console.log(authResult);
      if (authResult.isSuccess()) {
        this.router.navigateByUrl('/auth/systems');
      }
    });
  }
}
