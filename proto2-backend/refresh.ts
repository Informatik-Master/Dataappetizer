import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import fetch from 'cross-fetch';

const TABLE = process.env['DATAPOINT_TABLE'];
const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

export const handler = async () => {
  console.log('refreshing data...');
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
        vehicles: [
          {
            identifier: {
              type: 'VIN',
              value: 'V1RTUALV1N0000001',
            },
          },
        ],
        dataItems: ['mileage', 'geolocation'],
      }),
    },
  );

  const data = await subRes.json();

  for (const inVehicleData of data.inVehicleData) {
    for (const [datapointName, datapointValue] of Object.entries(
      inVehicleData.response,
    )) {
      await dynamoDbClient.send(
        new PutCommand({
          TableName: TABLE,
          Item: {
            vin: inVehicleData.identifier.value, // type: 'VIN',
            timestamp: Date.now(),
            datapoint: datapointName,
            value: (datapointValue as any).dataPoint,
          },
        }),
      );
    }
  }
};
