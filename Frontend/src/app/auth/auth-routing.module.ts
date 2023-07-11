import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'config',
        loadChildren: () =>
          import('./config/config.module').then((m) => m.ConfigModule),
      },
      {
        path: 'systems',
        loadChildren: () =>
          import('./systems/systems.module').then((m) => m.SystemsModule),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
