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
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  user: any = {};
  loggingIn = false;

  constructor(
    protected readonly router: Router,
    protected readonly nbAuth: NbAuthService
  ) {}

  async login() {
    this.loggingIn = true;
    this.nbAuth.authenticate('email', this.user).subscribe((authResult) => {
      this.loggingIn = false;
      if (authResult.isSuccess()) {
        this.router.navigateByUrl('/auth/systems');
      }
    });
  }
}
