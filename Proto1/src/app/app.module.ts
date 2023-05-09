import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ThemeModule } from './@theme/theme.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbAuthJWTToken, NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import { SocketIoModule } from 'ngx-socket-io';
import { CookieModule } from 'ngx-cookie';
import { NbToastrModule } from '@nebular/theme';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HammerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ThemeModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          baseEndpoint: '/api/',

          token: {
            class: NbAuthJWTToken,
            key: 'token',
          },
        }),
      ],
    }),
    SocketIoModule.forRoot({ url: 'http://localhost:3000', options: {} }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    CookieModule.withOptions({
      //TODO:
    }),
    NbToastrModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
