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
import { DateAgoModule } from '../@core/date-ago.module';

@Component({
  standalone: true,
  selector: 'ngx-information-ticker',
  imports: [CommonModule, NbCardModule, NbListModule, NbTreeGridModule, DateAgoModule],
  providers: [
    {
      provide: VisualizationComponent,
      useExisting: InformationTickerComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nb-card>
      <nb-card-header>
      <div style="display:flex; justify-content:space-between;margin-right: 1rem;">
        <span> Information Ticker </span>
        <span *ngIf="ago"> (Last updated: {{ ago|dateAgo }}) </span>
      </div>
      </nb-card-header>
      <nb-card-body class="p-0 gridster-item-content">
      <table [nbTreeGrid]="notifications" equalColumnsWidth>

          <tr nbTreeGridHeaderRow *nbTreeGridHeaderRowDef="allColumns"></tr>
          <tr nbTreeGridRow *nbTreeGridRowDef="let row; columns: allColumns "></tr>

          <ng-container *ngFor="let column of allColumns" [nbTreeGridColumnDef]="column">
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
  notifications: any[] = [];
  allColumns = ['Vehicle', 'Message', 'Value', 'Timestamp'];
  ago = 0;

  // data: any[] = [
  //   {
  //     data: { TIME: new Date().toISOString(), VIN: 'ABC', DATAPOINT: "test", VALUE: 'ABC' },
  //   },
  //   {
  //     data: { TIME: new Date().toISOString(), VIN: 'ABC', DATAPOINT: "test2", VALUE: 'Woop' },
  //   },
  // ]

  public constructor(
    protected readonly dataPointService: DataPointService,
    private readonly changeDetectionRef: ChangeDetectorRef
  ) {
    super();
  }

  public override setMockData(): void {
    super.setMockData();
    this.notifications = [
      { data: {Vehicle: 'VIN1' , Message: 'New Location' , Value: 'Lat: 46.99, Long: 8.45' , Timestamp: '27.05.2023 16:10'}},
      { data: {Vehicle: 'VIN1' , Message: 'New Milage' , Value: '42.98 km' , Timestamp: '27.05.2023 16:10'}},
      { data: {Vehicle: 'VIN2' , Message: 'New Location' , Value: 'Lat: 49.01, Lat: 8.40' , Timestamp: '27.05.2023 15:56'}},
      { data: {Vehicle: 'VIN3' , Message: 'New Engine Status' , Value: 'ON', Timestamp: '27.05.2023 15:48'}},
      { data: {Vehicle: 'VIN2' , Message: 'New Engine Status' , Value: 'ON', Timestamp: '27.05.2023 15:14'}},
      { data: {Vehicle: 'VIN4' , Message: 'Warning' , Value: 'Breakpad' , Timestamp: '27.05.2023 14:47'}}
    ];
  }

  public ngOnInit(): void {
    if (this.previewMode) return;
    this.subscription = this.dataPointService.dataPoint$
      .pipe(
        filter(({ event }: any) => event === 'geolocation'),
        bufferTime(1000)
      )
      .subscribe((bufferedEvents: any) => {
        for (const { event, data } of bufferedEvents) {
          //TODO:
          let dateString = new Date(data.value.value.timestamp).toUTCString();
          if (event === 'geolocation') {
            const { vin, value } = data;
            const lat = value.value.latitude;
            const lng = value.value.longitude;

            this.notifications.unshift(
              { data: {Vehicle: `${vin}`, Message: 'New Location', Value: `Lat: ${lat} Long: ${lng}`, Timestamp: `${dateString}`}}
              // `${vin} has a new location: ${lat} ${lng}`
            );
          }
          else if (event === 'averagedistance') {
            this.notifications.unshift(
              { data: {Vehicle: `${data.value.vin}`, Message: 'New Average Distance', Value: `${data.value.value.value}`, Timestamp: `${dateString}`}}
              // `${data.value.vin} has a new average distance: ${data.value.value.value}`
            );
          } else if (event === 'mileage') {
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Milage', Value: `${data.value.value.value} ${data.value.value.unit}`, Timestamp: `${dateString}`}}
              // `${data.vin} has a new milage: ${data.value.value.value} ${data.value.value.unit}`
            );
          } else if (event === 'enginestatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Engine Status', Value: `${data.value.value.value}`, Timestamp: `${dateString}`}}
              // `${data.vin} has a new engine status: ${data.value.value.value}`
            );
          else if (event === 'soclowlevel')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Soclevel', Value: `${data.value.value.value} ${data.value.value.unit}`, Timestamp: `${dateString}`}}
              // `${data.vin} has a new soclevel: ${data.value.value.value} ${data.value.value.unit}`
            );
          else if (event === 'fueldoorlockstatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Fueldoor Lock Status', Value: `${data.value.value.value}`, Timestamp: `${dateString}`}}
              // `${data.vin} fueldoor is now in lock status: ${data.value.value.value}`
            );
          else if (event === 'nextservicedistance')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'Needs A service At', Value: `${data.value.value.value} ${data.value.value.unit}`, Timestamp: `${dateString}`}}
              // `${data.vin} needs a service at ${data.value.value.value} ${data.value.value.unit}`
            );
          else if (event === 'hoodlockstatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Lock Status Of Hook', Value: `${data.value.value.value}`, Timestamp: `${dateString}`}}
              // `${data.vin} has a new lock status of the hook lock: ${data.value.value.value}`
            );
          else if (event === 'hoodstatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Hood Status', Value: `${data.value.value.value}`, Timestamp: `${dateString}`}}
              // `${data.vin} has a new hoodstatus: ${data.value.value.value}`
            );
          else if (event === 'convertibletopstatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Convertible Top Status', Value: `${data.value.value.value} ${data.value.value.unit}`, Timestamp: `${dateString}`}}
              // `${data.vin} has a convertible top status: ${data.value.value.value} ${data.value.value.unit}`
            );
          else if (event === 'rearrightdoorlockstatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Lock Status Of The Rear Righthand Door', Value: `${data.value.value.value}`, Timestamp: `${dateString}`}}
              // `${data.vin} has a new lock status of the rear righthand door: ${data.value.value.value}`
            );
          else if (event === 'rearleftwindowstatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Window Status Of The Rear Lefthand Window', Value: `${data.value.value.value}`, Timestamp: `${dateString}`}}
              // `${data.vin} has a new window status of the rear lefthand window: ${data.value.value.value}`
            );
          else if (event === 'environmentaltemperature')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Environment Temperature', Value: `${data.value.value.value} ${data.value.value.unit}`, Timestamp: `${dateString}`}}
              // `${data.vin} has environment temperature: ${data.value.value.value} ${data.value.value.unit}`
            );
          else if (event === 'coolanttemperature')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Coolant Temperature', Value: `${data.value.value.value} ${data.value.value.unit}`, Timestamp: `${dateString}`}}
              // `${data.vin} has coolant temperature: ${data.value.value.value} ${data.value.value.unit}`
            );
          else if (event === 'checkcontrolmessages')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Control Message', Value: `${data.value.value.message}`, Timestamp: `${dateString}`}}
              // `${data.vin} has control message: ${data.value.value.message}`
            );


            else if (event === 'fuelremaining')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Fuel Remaining', Value: `${data.value.value.value} ${data.value.value.unit}`, Timestamp: `${dateString}`}}
              // `${data.vin} has fuel remaining for: ${data.value.value.value} ${data.value.value.unit}`
            );

            else if (event === 'frontleftdoorstatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Door Status Of The Front Lefthand Door', Value: `${data.value.value.value}`, Timestamp: `${dateString}`}}
              // `${data.vin} has a new door status of the front lefthand door: ${data.value.value.value}`
            );

            else if (event === 'vehicleheading')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Heading Direction', Value: `${data.value.value.value} ${data.value.value.unit}`, Timestamp: `${dateString}`}}
              // `${data.vin} is now heading: ${data.value.value.value} ${data.value.value.unit}`
            );

            else if (event === 'vehiclelockstatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Lock Status', Value: `${data.value.value.value} ${data.value.value.unit}`, Timestamp: `${dateString}`}}
              // `${data.vin} is now in lock status: ${data.value.value.value} ${data.value.value.unit}`
            );

            else if (event === 'trunkstatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Trunk Status', Value: `${data.value.value.value}`, Timestamp: `${dateString}`}}
              // `${data.vin} has a new trunk status: ${data.value.value.value}`
            );

            else if (event === 'ignitionstatus')
            this.notifications.unshift(
              { data: {Vehicle: `${data.vin}`, Message: 'New Ignition Status', Value: `${data.value.value.value}`, Timestamp: `${dateString}`}}
              // `${data.vin} has the ignition status: ${data.value.value.value}`
            );
            this.ago = data.value.timestamp;
        }
        this.notifications = [...this.notifications]
        this.changeDetectionRef.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
