import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { DateAgoPipe } from './date-ago.pipe';

@NgModule({
  exports: [DateAgoPipe],
  declarations: [DateAgoPipe],
})
export class DateAgoModule {

}
