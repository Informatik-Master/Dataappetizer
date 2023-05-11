import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import chunk from 'lodash.chunk';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const apigatewaymanagementapi = new ApiGatewayManagementApiClient({
  endpoint: 'http://localhost:3001',
});

const VEHICLES = [
  // TODO: get from db
  'V1RTUALV1N0000001',
  'V1RTUALV1N0000002',
  'V1RTUALV1N0000003',
  'V1RTUALV1N0000004',
  'V1RTUALV1NRAND003',
  'V1RTUALV1NRAND004',
  'V1RTUALV1NRAND005',
  'V1RTUALV1N0000S06',
  'V1RTUALV1NDETE005',
];

export const initialConnect = async ({ Records }: any) => {
  for (const record of Records) {
    const { dynamodb } = record;

    const payload = dynamodb?.NewImage;
    if (!payload) continue;

    console.log('payload', payload);
    const { connectionId } = unmarshall(payload);

    const v = VEHICLES.map(async (vin) => {
      const { Items } = await dynamoDbClient.send(
        new QueryCommand({
          TableName: process.env['DATAPOINT_TABLE'],
          KeyConditionExpression: 'vin = :vin',
          ExpressionAttributeValues: {
            ':vin': vin,
          },
          ScanIndexForward: false,
        }),
      );

      return Items!.flatMap((item) => {
        const { vin, datapointName, value } = item;
        return [
          {
            event: datapointName,
            data: {
              vin,
              value: item,
            },
          },

          {
            event: 'message',
            data: {
              vin,
              datapointName,
              value: item,
            },
          },
        ];
      });
    });
    const res = (await Promise.all(v)).flat(1);
    console.log('res', res);
    console.log('pushing to connectionId', connectionId);

    await Promise.all(
      chunk(res, 200).map(async (chunk) => {
        try {
          await apigatewaymanagementapi.send(
            new PostToConnectionCommand({
              ConnectionId: connectionId,
              Data: Buffer.from(JSON.stringify(chunk)),
            }),
          );
        } catch (e) {
          console.log(e);
        }
      }),
    );
  }
};
