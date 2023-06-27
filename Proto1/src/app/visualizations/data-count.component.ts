import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { bufferTime, Subscription } from 'rxjs';

import { DataPointService } from '../@core/data-point.service';
import { VisualizationComponent } from './visualization-component.interface';
import { DateAgoModule } from '../@core/date-ago.module';

@Component({
  standalone: true,
  selector: 'ngx-data-count',
  imports: [CommonModule, NbCardModule, DateAgoModule],
  providers: [
    { provide: VisualizationComponent, useExisting: DataCountComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card>
      <nb-card-header>
        <div style="display:flex; justify-content:space-between;margin-right: 1rem;">
          <span> Data Count </span>
          <span *ngIf="ago"> (Last updated: {{ ago|dateAgo }}) </span>
        </div>
      </nb-card-header>
      <nb-card-body class="gridster-item-content">
        <h6 class="m-0">{{ vins.size }} Vehicles</h6>
        <span class="caption-2"> {{ numberDataPoints }} Datapoints</span>
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
        nb-card-body {
          container-type: inline-size;
          h6 {
            line-height: 5cqw;
            font-size: 5cqw;
          }
          span {
            line-height: 5cqw;
            font-size: 5cqw;
          }
        }
      }
    `,
  ],
})
export class DataCountComponent extends VisualizationComponent {
  private subscription: Subscription | null = null;

  vins = new Set<string>();
  numberDataPoints = 0;
  ago = 0;

  public constructor(
    protected readonly dataPointService: DataPointService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    super();
  }

  public override setMockData(): void {
    super.setMockData();
    this.numberDataPoints = 50;
    this.vins = new Set<string>(['Test1', 'Test2', 'Test3', 'Test4', 'Test5']);
  }

  public ngOnInit(): void {
    if (this.previewMode) return;
    this.subscription = this.dataPointService.dataPoint$
      .pipe(bufferTime(1000))
      .subscribe((bufferedEvents) => {
        for (const { data } of bufferedEvents) {
          this.vins.add(data.vin);
          this.numberDataPoints++;
          this.ago = data.value.timestamp;

        }
        this.changeDetectionRef.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
