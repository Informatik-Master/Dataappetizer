import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DataPointService } from '../@core/data-point.service';
import { CommonModule } from '@angular/common';

import { NbCardModule, NbListModule, NbTreeGridModule } from '@nebular/theme';
import { bufferTime, filter, Subscription } from 'rxjs';
import { VisualizationComponent } from './visualization-component.interface';

@Component({
  standalone: true,
  selector: 'ngx-information-ticker',
  imports: [CommonModule, NbCardModule, NbListModule, NbTreeGridModule],
  providers: [
    {
      provide: VisualizationComponent,
      useExisting: InformationTickerComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card>
      <nb-card-header> Information Ticker </nb-card-header>
      <nb-card-body class="p-0 gridster-item-content">
      <table [nbTreeGrid]="data" equalColumnsWidth>

          <tr nbTreeGridHeaderRow *nbTreeGridHeaderRowDef="defaultColumns"></tr>
          <tr nbTreeGridRow *nbTreeGridRowDef="let row; columns: defaultColumns "></tr>

          <ng-container *ngFor="let column of defaultColumns" [nbTreeGridColumnDef]="column">
          <th nbTreeGridHeaderCell *nbTreeGridHeaderCellDef>
            {{column}}
          </th>
            <td nbTreeGridCell *nbTreeGridCellDef="let row">{{row.data[column]}}</td>
          </ng-container>

          </table>
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

  data: any[] = [
    {
      data: { TIME: new Date().toISOString(), VIN: 'ABC', DATAPOINT: "test", VALUE: 'ABC' },
    },
    {
      data: { TIME: new Date().toISOString(), VIN: 'ABC', DATAPOINT: "test2", VALUE: 'Woop' },
    },
  ]
  defaultColumns = [ 'TIME', 'VIN', 'DATAPOINT', 'VALUE' ];


  public constructor(
    protected readonly dataPointService: DataPointService,
    private readonly changeDetectionRef: ChangeDetectorRef
  ) {
    super();
  }

  public override setMockData(): void {
    this.notifications = [
      'VIN1 has a new location: 46.99 8.45, 27.05.2023 16:10',
      'VIN1 has a new milage: 42.98 km, 27.05.2023 16:00',
      'VIN2 has a new location: 49.01 8.40, 27.05.2023 15:56',
      'VIN3 has a new engine status: ON, 27.05.2023 15:48',
      'VIN2 has a new engine status: ON, 27.05.2023 15:14',
      'VIN4 shows warning: Breakpad, 27.05.2023 14:47',
    ];
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
              `${vin} has a new location: ${lat} ${lng}`
            );
          } else if (event === 'averagedistance') {
            this.notifications.unshift(
              `${data.value.vin} has a new average distance: ${data.value.value.value}`
            );
          } else if (event === 'mileage') {
            this.notifications.unshift(
              `${data.vin} has a new milage: ${data.value.value.value} ${data.value.value.unit}`
            );
          } else if (event === 'enginestatus')
            this.notifications.unshift(
              `${data.vin} has a new engine status: ${data.value.value.value}`
            );
          else if (event === 'soclowlevel')
            this.notifications.unshift(
              `${data.vin} has a new soclevel: ${data.value.value.value} ${data.value.value.unit}`
            );
          else if (event === 'fueldoorlockstatus')
            this.notifications.unshift(
              `${data.vin} fueldoor is now in lock status: ${data.value.value.value}`
            );
          else if (event === 'nextservicedistance')
            this.notifications.unshift(
              `${data.vin} needs a service at ${data.value.value.value} ${data.value.value.unit}`
            );
          else if (event === 'hoodlockstatus')
            this.notifications.unshift(
              `${data.vin} has a new lock status of the hook lock: ${data.value.value.value}`
            );
          else if (event === 'hoodstatus')
            this.notifications.unshift(
              `${data.vin} has a new hoodstatus: ${data.value.value.value}`
            );
          else if (event === 'convertibletopstatus')
            this.notifications.unshift(
              `${data.vin} has a convertible top status: ${data.value.value.value} ${data.value.value.unit}`
            );
          else if (event === 'rearrightdoorlockstatus')
            this.notifications.unshift(
              `${data.vin} has a new lock status of the rear righthand door: ${data.value.value.value}`
            );
          else if (event === 'rearleftwindowstatus')
            this.notifications.unshift(
              `${data.vin} has a new window status of the rear lefthand window: ${data.value.value.value}`
            );
          else if (event === 'environmentaltemperature')
            this.notifications.unshift(
              `${data.vin} has environment temperature: ${data.value.value.value} ${data.value.value.unit}`
            );
          else if (event === 'coolanttemperature')
            this.notifications.unshift(
              `${data.vin} has coolant temperature: ${data.value.value.value} ${data.value.value.unit}`
            );
          else if (event === 'checkcontrolmessages')
            this.notifications.unshift(
              `${data.vin} has control message: ${data.value.value.message}`
            );


            else if (event === 'fuelremaining')
            this.notifications.unshift(
              `${data.vin} has fuel remaining for: ${data.value.value.value} ${data.value.value.unit}`
            );

            else if (event === 'frontleftdoorstatus')
            this.notifications.unshift(
              `${data.vin} has a new door status of the front lefthand door: ${data.value.value.value}`
            );

            else if (event === 'vehicleheading')
            this.notifications.unshift(
              `${data.vin} is now heading: ${data.value.value.value} ${data.value.value.unit}`
            );

            else if (event === 'vehiclelockstatus')
            this.notifications.unshift(
              `${data.vin} is now in lock status: ${data.value.value.value} ${data.value.value.unit}`
            );

            else if (event === 'trunkstatus')
            this.notifications.unshift(
              `${data.vin} has a new trunk status: ${data.value.value.value}`
            );

            else if (event === 'ignitionstatus')
            this.notifications.unshift(
              `${data.vin} has the ignition status: ${data.value.value.value}`
            );

        }
        this.changeDetectionRef.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
