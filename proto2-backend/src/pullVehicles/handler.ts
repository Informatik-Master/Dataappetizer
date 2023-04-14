import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import fetch from 'cross-fetch';

const TABLE = process.env['VEHICLES_TABLE'];
const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

export const handler = async () => {
  console.log('refreshing vehicles...');
  const subRes = await fetch(
    'https://api.caruso-dataplace.com/management/v1/vehicles',
    {
      method: 'Get',
      headers: {
        Accept: 'application/json',
        'X-Subscription-Id': 'ada3836d-bd98-483e-86d4-bc0b8cc8e470',
        'X-API-Key':
          'ah30goc8c8bstjo6af0c4br52l4lket7bdqm8fob8iqft4e4p8u906t32gssa5d83BDA',
      },
    },
  );
  if (!subRes.ok) throw new Error('Failed to fetch vehicles');

  const data = await subRes.json();

  await Promise.all(
    data.map((vehicleData: any) =>
      dynamoDbClient.send(
        new PutCommand({
          TableName: TABLE,
          Item: vehicleData,
        }),
      ),
    ),
  );
};
