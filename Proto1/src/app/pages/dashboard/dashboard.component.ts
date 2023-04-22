import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';

import {
  control,
  FeatureGroup,
  LatLng,
  latLng,
  LayerGroup,
  Map as LefletMap,
  MapOptions,
  Marker,
  marker,
  tileLayer,
} from 'leaflet';
import ReconnectingWebSocket from 'reconnecting-websocket';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  constructor(private readonly cdRef: ChangeDetectorRef){}

  vehicles = new Map<string, number>();

  markers = new Map<string, Marker>();

  ngOnInit(): void {
    const socket = new ReconnectingWebSocket('ws://localhost:3001');

    socket.addEventListener('open', (event) => {
      console.log('socket open');
      console.log(event);
    });

    const update = (parsed: any) => {
      if (parsed.event === 'getDiagram') {
        this.echartMerge = {
          series: [
            {
              data: parsed.data,
            },
          ],
        };
      } else if (parsed.event === 'geolocation') {
        const { vin, value } = parsed.data;
        const lat = value.value.latitude;
        const lng = value.value.longitude;
        const latLng = new LatLng(lat, lng);
        this.markers.set(
          vin,
          marker(latLng, {
            title: vin,
          })
        ),
          this.markerLayer.clearLayers();
        [...this.markers.values()].forEach((marker) => {
          this.markerLayer.addLayer(marker);
        });
        this.map?.fitBounds(this.markerLayer.getBounds().pad(0.2), {
          animate: true,
          duration: 1,
        }); //TODO: only on init
        this.notifications = [
          `${vin} hat einen neuen Standort: ${lat} ${lng}`,
          ...this.notifications,
        ];
        // } else if (parsed.event === 'message') {
        //   const newMessage = `[${parsed.data.value.vin}] hat einen neuen Datenpunkt ${
        //     parsed.data.value.datapointName
        //   } mit dem Wert ${JSON.stringify(parsed.data.value.value || {})}`;
        //   this.notifications = [newMessage, ...this.notifications];

        //   //TODO: This is still in the works
        //   this.vehicles.set(
        //     parsed.data.value.vin,
        //     (this.vehicles.get(parsed.data.value.vin) || 0) + 1
        //   );
      } else if (parsed.event === 'averagedistance') {
        const currentVal = (
          (this.echartMerge.series as SeriesOption[])[0].data as any[]
        )?.find((d) => d.name === parsed.data.value.vin);
        if (currentVal) {
          currentVal.data = parsed.data.value.value.value;
        } else {
          ((this.echartMerge.series as SeriesOption[])[0].data as any[])?.push({
            name: parsed.data.value.vin,
            value: parsed.data.value.value.value,
          });
        }
        this.echartMerge = {
          ...this.echartMerge,
        };
        this.notifications = [
          `${parsed.data.value.vin} hat einen neuen Kilometer-Durchschnitt: ${parsed.data.value.value.value}`,
          ...this.notifications,
        ];
      } else if (parsed.event === 'mileage') {
        const s = this.echartOptions2Merge.series as SeriesOption[];
        let abc: any = s.find((s) => s.name === parsed.data.vin);
        if (!abc) {
          abc = {
            name: parsed.data.vin,
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
            data: new Array<any[]>(),
          };
          s.push(abc);
        }
        abc.data!.push([
          parsed.data.value.timestamp,
          parsed.data.value.value.value,
        ]);
        abc.data = (abc.data as any[]).sort((a: any, b: any) => a[0] - b[0]);
        this.echartOptions2Merge = {
          ...this.echartOptions2Merge,
        };
        this.notifications = [
          `${parsed.data.vin} hat einen neuen Kilometerstand: ${parsed.data.value.value.value} ${parsed.data.value.value.unit}`,
          ...this.notifications,
        ];
      } else if (parsed.event === 'message') {
        //TODO: This is still in the works
        this.vehicles.set(
          parsed.data.vin,
          (this.vehicles.get(parsed.data.vin) || 0) + 1
        );
      }
    };

    socket.addEventListener('message', (event) => {
      const parsed = JSON.parse(event.data);
      if (Array.isArray(parsed)) {
        parsed.forEach((p) => update(p));
      } else {
        update(parsed);
      }
      this.cdRef.detectChanges();
      // console.log('parsed', parsed);
    });

    socket.addEventListener('error', (event) => {
      console.log('error', event);
    });

    socket.addEventListener('close', function (event) {
      console.log('socket close');
    });
  }

  getDatapointCount() {
    return [...this.vehicles.values()].reduce((a, b) => a + b, 0);
  }

  echartMerge: EChartsOption = {
    series: [{ data: [] }],
  };

  echartOptions: EChartsOption = {
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        data: [],
      },
    ],
  };

  echartOptions2: EChartsOption = {
    legend: {},
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
    },
    grid: {
      right: '10px',
      left: '70px',
      bottom: '25px',
      top: '35px',
    },
    series: [],
  };

  echartOptions2Merge: EChartsOption = {
    series: [],
  };

  notifications: string[] = [];

  private readonly markerLayer = new FeatureGroup();
  mapOptions: MapOptions = {
    zoomControl: false,
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }),
      this.markerLayer,
    ],
    zoom: 5,
    center: latLng({ lat: 49.488888, lng: 8.469167 }),
    minZoom: 5,
  };

  map: LefletMap | null = null;

  onMapReady(map: LefletMap) {
    this.map = map;
    this.map.setZoom(13);
    control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);
    setTimeout(() => {
      map.invalidateSize();
    }, 10);
  }
}
