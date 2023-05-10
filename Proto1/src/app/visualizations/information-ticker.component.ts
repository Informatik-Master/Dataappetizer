import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DataPointService } from '../@core/data-point.service';
import { CommonModule } from '@angular/common';

import { NbCardModule, NbListModule } from '@nebular/theme';
import { bufferTime, filter, Subscription } from 'rxjs';
import { VisualizationComponent } from './visualization-component.interface';

@Component({
  standalone: true,
  selector: 'ngx-information-ticker',
  imports: [CommonModule, NbCardModule, NbListModule],
  providers: [
    {
      provide: VisualizationComponent,
      useExisting: InformationTickerComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card>
      <nb-card-header> Informationsticker </nb-card-header>
      <nb-card-body class="p-0">
        <nb-list>
          <nb-list-item *ngFor="let notification of notifications">
            {{ notification }}
          </nb-list-item>
        </nb-list>
      </nb-card-body>
    </nb-card>
  `,
  styles: [
    `
      nb-card {
        max-height: 100%;
      }
    `,
  ],
})
export class InformationTickerComponent extends VisualizationComponent {
  private subscription: Subscription | null = null;
  notifications: string[] = [];

  public constructor(protected readonly dataPointService: DataPointService, private readonly changeDetectionRef: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this.subscription = this.dataPointService.dataPoint$
      .pipe(
        filter(({ event }) => event === 'geolocation'),
        bufferTime(1000)
      )
      .subscribe((bufferedEvents) => {
        for (const { event, data } of bufferedEvents) {
          //TODO:
          if (event === 'geolocation') {
            const { vin, value } = data;
            const lat = value.value.latitude;
            const lng = value.value.longitude;

            this.notifications = [
              `${vin} hat einen neuen Standort: ${lat} ${lng}`,
              ...this.notifications,
            ];
          } else if (event === 'averagedistance') {
            this.notifications = [
              `${data.value.vin} hat einen neuen Kilometer-Durchschnitt: ${data.value.value.value}`,
              ...this.notifications,
            ];
          } else if (event === 'mileage') {
            this.notifications = [
              `${data.vin} hat einen neuen Kilometerstand: ${data.value.value.value} ${data.value.value.unit}`,
              ...this.notifications,
            ];
          }
        }
        this.changeDetectionRef.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
