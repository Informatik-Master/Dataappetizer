import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbActionsModule,
  NbContextMenuModule,
  NbDialogModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule,
  NbUserModule,
} from '@nebular/theme';
import { HeaderComponent } from './components/header/header.component';

import { MainLayoutComponent } from './layouts/main.layout';

const NB_MODULES = [

  NbMenuModule.forRoot(),
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbIconModule,
  NbEvaIconsModule,
  NbContextMenuModule,
  NbDialogModule.forRoot(),
  NbToastrModule.forRoot(),
];
const COMPONENTS = [
  MainLayoutComponent,
  HeaderComponent
];
const PIPES: any[] = [
];

@NgModule({
  imports: [CommonModule, NbThemeModule.forRoot(),   NbLayoutModule, ...NB_MODULES],
  exports: [CommonModule, NbThemeModule, ...NB_MODULES, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [],
    };
  }
}
