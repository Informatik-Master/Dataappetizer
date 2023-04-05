import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SystemsComponent } from './systems.component';

const routes: Routes = [
  {
    path: '',
    component: SystemsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemsRoutingModule {}
