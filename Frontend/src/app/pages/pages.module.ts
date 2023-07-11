import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';


@NgModule({
  imports: [PagesRoutingModule, ThemeModule],
  declarations: [PagesComponent],
})
export class PagesModule { }
