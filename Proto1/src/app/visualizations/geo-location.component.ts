import { Component } from '@angular/core';
import { DataPointService } from '../@core/data-point.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'ngx-geo-location',
  imports: [CommonModule],
  template: `
    <div>
      {{ dataPointService.dataPoint$ | async |json }}
    </div>
  `,
})
export class GeoLocationComponent {
  public constructor(protected readonly dataPointService: DataPointService) {

  }

}
