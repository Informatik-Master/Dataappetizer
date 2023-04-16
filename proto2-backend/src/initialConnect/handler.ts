import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const apigatewaymanagementapi = new ApiGatewayManagementApiClient({
  endpoint: 'http://localhost:3001',
});

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

export const initialConnect = async ({ Records }: any) => {
  for (const record of Records) {
    const { dynamodb } = record;

    const payload = dynamodb?.NewImage;
    if (!payload) continue;

    console.log('payload', payload);
    const { connectionId } = unmarshall(payload);

    for (const vin of VEHICLES) {
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

      for (const item of Items!) {
        const { vin, datapointName, value } = item;

        let bufferData: any = {
          event: datapointName,
          data: {
            vin,
            value,
          },
        };

        await apigatewaymanagementapi.send(
          new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: Buffer.from(JSON.stringify(bufferData)),
          }),
        );

        bufferData = {
          event: 'message',
          data: {
            vin,
            datapointName,
            value,
          },
        };

        await apigatewaymanagementapi.send(
          new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: Buffer.from(JSON.stringify(bufferData)),
          }),
        );
      }
    }
  }
};
