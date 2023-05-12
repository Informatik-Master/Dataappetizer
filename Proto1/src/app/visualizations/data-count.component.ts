import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { bufferTime, Subscription } from 'rxjs';

import { DataPointService } from '../@core/data-point.service';
import { VisualizationComponent } from './visualization-component.interface';

@Component({
  standalone: true,
  selector: 'ngx-data-count',
  imports: [CommonModule, NbCardModule],
  providers: [
    { provide: VisualizationComponent, useExisting: DataCountComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card>
      <nb-card-header> Datenanzahl</nb-card-header>
      <nb-card-body class="gridster-item-content">
        <h6 class="m-0">{{ vins.size }} Fahrzeuge</h6>
        <span class="caption-2"> {{ numberDataPoints }} Datenpunkte</span>
      </nb-card-body>
    </nb-card>
  `,
  //TODO: shared styles
  styles: [
    `
      nb-card {
        height: 100%;
        max-height: 100%;
        margin: 0;
      }
    `,
  ],
})
export class DataCountComponent extends VisualizationComponent {
  private subscription: Subscription | null = null;

  vins = new Set<string>();
  numberDataPoints = 0;

  public constructor(protected readonly dataPointService: DataPointService, private changeDetectionRef: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this.subscription = this.dataPointService.dataPoint$
      .pipe(bufferTime(1000))
      .subscribe((bufferedEvents) => {
        for (const { data } of bufferedEvents) {
          this.vins.add(data.vin);
          this.numberDataPoints++;
        }
        this.changeDetectionRef.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
