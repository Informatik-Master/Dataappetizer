import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
  PutCommand,

  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import fetch from 'cross-fetch';
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';

import chunk from 'lodash.chunk';

const VEHICLES = [
  'V1RTUALV1N0000001',
  'V1RTUALV1N0000002',
  'V1RTUALV1N0000003',
  'V1RTUALV1N0000004',
  // 'V1RTUALV1N0000S05',
  // 'V1RTUALV1N0000S06',
  // 'V1RTUALV1N0000S07',
  // 'V1RTUALV1N0000S08',
  // 'V1RTUALV1N0000S09',
  // 'V1RTUALV1N0000S10',
  // 'V1RTUALV1N0000S11',
  // 'V1RTUALV1N0000S12',
  // 'V1RTUALV1N0000S13',
];

const TABLE = process.env['DATAPOINT_TABLE'];
const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const apigatewaymanagementapi = new ApiGatewayManagementApiClient({
  endpoint: 'http://localhost:3001',
});

export const handler = async () => {
  console.log('refreshing data...');

  let LastEvaluatedKey: Record<string, any> | undefined = undefined;
  // const vehicles: string[] = [];
  // do {
  //   const option = {
  //     TableName: process.env['VEHICLES_TABLE'],
  //   } as ScanCommandInput;
  //   if (LastEvaluatedKey) option.ExclusiveStartKey = LastEvaluatedKey;

  //   const resp = await dynamoDbClient.send(new ScanCommand(option));
  //   if (resp.Items) vehicles.push(...resp.Items.map((i) => i['vin']));
  //   LastEvaluatedKey = resp.LastEvaluatedKey;
  // } while (LastEvaluatedKey);

  const chunks = chunk(VEHICLES, 10);

  await Promise.all(
    chunks.map(async (chunk) => { //TODO: Batch
      const subRes = await fetch(
        'https://api.caruso-dataplace.com/delivery/v1/in-vehicle',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Subscription-Id': 'ada3836d-bd98-483e-86d4-bc0b8cc8e470',
            'X-API-Key':
              'ah30goc8c8bstjo6af0c4br52l4lket7bdqm8fob8iqft4e4p8u906t32gssa5d83BDA',
          },
          body: JSON.stringify({
            version: '1.0',
            vehicles: chunk.map((v) => ({
              identifier: {
                type: 'VIN',
                value: v,
              },
            })),
            dataItems: ['geolocation', 'mileage'],
          }),
        },
      );
      const data = await subRes.json();

      const promises: Promise<any>[] = [];
      for (const inVehicleData of data.inVehicleData) {
        for (const [datapointName, datapointValue] of Object.entries(
          inVehicleData.response,
        )) {
          promises.push(
            dynamoDbClient.send(
              new PutCommand({
                TableName: TABLE,
                Item: {
                  vin: inVehicleData.identifier.value, // type: 'VIN',
                  timestamp: Date.now(),
                  datapointName,
                  vinWithDataPointName: `${inVehicleData.identifier.value}#${datapointName}`,
                  value: (datapointValue as any).dataPoint,
                },
              }),
            ),
          );
        }
      }
      await Promise.all(promises);
    }),
  );
};
