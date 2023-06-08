import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'car',
        loadChildren: () =>
          import('./car/car.module').then((m) => m.CarModule),
      },
      //TODO: Settings

      {
        path: 'settings',
        //redirectTo: 'auth/systems'
        loadChildren: () => 
          import('../auth/config/config.module').then((m) => m.ConfigModule)
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
