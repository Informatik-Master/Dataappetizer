import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ApiService {
    constructor(private readonly httpService: HttpService) { }

    getCarsInformation() {
        let response = this.httpService.get("https://api.caruso-dataplace.com/management/v1/vehicles",
            {
                headers: {
                    'X-API-Key': "ah30goc8c8bstjo6af0c4br52l4lket7bdqm8fob8iqft4e4p8u906t32gssa5d83BDA",
                    'X-Subscription-Id': "ada3836d-bd98-483e-86d4-bc0b8cc8e470",
                    'Content-Type': 'application/json',
                }
            }
        );
        let data = response.pipe(map(response => response.data));
        return data;
    }

    getSingleCarDetailInformation(vin:String, dataItems: String[]) {
        let response = this.httpService.post("https://api.caruso-dataplace.com/delivery/v1/in-vehicle",
            {
                "dataItems": dataItems,
                "vehicles": [
                    {
                        "identifier": {
                            "type": "VIN",
                            "value": vin
                        }
                    }
                ],
                "version": "1.0"
            },
            {
                headers: {
                    'X-API-Key': "ah30goc8c8bstjo6af0c4br52l4lket7bdqm8fob8iqft4e4p8u906t32gssa5d83BDA",
                    'X-Subscription-Id': "ada3836d-bd98-483e-86d4-bc0b8cc8e470",
                    'Content-Type': 'application/json',
                }
            }
        );
        let data = response.pipe(map(response => response.data));
        return data;
    }
}
