import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
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
      <nb-card-body class="p-0 gridster-item-content">
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

  public constructor(
    protected readonly dataPointService: DataPointService,
    private readonly changeDetectionRef: ChangeDetectorRef
  ) {
    super();
  }

  public override setMockData(): void {
    this.notifications = [
      "VIN1 hat einen neuen Standort: 46.99 8.45, 27.05.2023 16:10",
      "VIN1 hat einen neuen Kilometerstand: 42.98 km, 27.05.2023 16:00",
      "VIN2 hat einen neuen Standort: 49.01 8.40, 27.05.2023 15:56",
      "VIN3 hat einen neuen Motorstatus: Eingeschaltet, 27.05.2023 15:48",
      "VIN2 hat einen neuen Motorstatus: Eingeschaltet, 27.05.2023 15:14",
      "VIN4 zeigt eine Warnung an: Bremsscheiben, 27.05.2023 14:47",
    ]
    console.log(this.notifications);
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

            this.notifications.unshift(
              `${vin} hat einen neuen Standort: ${lat} ${lng}`
            );
          } else if (event === 'averagedistance') {
            this.notifications.unshift(
              `${data.value.vin} hat einen neuen Kilometer-Durchschnitt: ${data.value.value.value}`
            );
          } else if (event === 'mileage') {
            this.notifications.unshift(
              `${data.vin} hat einen neuen Kilometerstand: ${data.value.value.value} ${data.value.value.unit}`
            );
          }
        }
        this.changeDetectionRef.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
