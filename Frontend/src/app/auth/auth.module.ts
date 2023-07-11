import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbAuthModule } from '@nebular/auth';

import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbMenuModule,
  NbSpinnerModule,
  NbToastrModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbIconModule,
    FormsModule,
    NbAlertModule,
    NbInputModule,
    NbCheckboxModule,
    NbButtonModule,
    NbSpinnerModule,
    NbAuthModule,
    HttpClientModule
  ],
  declarations: [
    LoginComponent
  ],
})
export class AuthModule {}
