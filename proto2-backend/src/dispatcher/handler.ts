import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
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

export const dispatcher = async ({ Records }: any) => {
  const { Items } = await dynamoDbClient.send(
    new ScanCommand({
      TableName: process.env['CONNECTIONS_TABLE'],
    }),
  );

  const promised = [];
  for (const record of Records) {
    const { dynamodb } = record;

    const payload = dynamodb?.NewImage;
    if (!payload) continue;

    const unmarshalledPayload = unmarshall(payload);

    const sendToAll = async (bufferData: {
      event: string;
      data: Record<string, any>;
    }) =>
      Items!.map((item) =>
        apigatewaymanagementapi.send(
          // what happens if the connection is closed?
          new PostToConnectionCommand({
            ConnectionId: item['connectionId'],
            Data: Buffer.from(JSON.stringify(bufferData)),
          }),
        ),
      );

    //TODO: push all this on connect
    if (unmarshalledPayload['datapointName'] === 'geolocation') {
      promised.push(
        sendToAll({
          event: 'geolocation',
          data: {
            vin: unmarshalledPayload['vin'],
            value: unmarshalledPayload,
          },
        }),
      );
    }
    if (unmarshalledPayload['datapointName'] === 'averagedistance') {
      promised.push(
        sendToAll({
          event: 'averagedistance',
          data: {
            vin: unmarshalledPayload['vin'],
            value: unmarshalledPayload,
          },
        }),
      );
    }
    if (unmarshalledPayload['datapointName'] === 'mileage') {
      promised.push(
        sendToAll({
          event: 'mileage',
          data: {
            vin: unmarshalledPayload['vin'],
            value: unmarshalledPayload,
          },
        }),
      );
    }
    // promised.push(
    //   sendToAll({
    //     event: 'message',
    //     data: {
    //       vin: unmarshalledPayload['vin'],
    //       datapointName: unmarshalledPayload['datapointName'],
    //       value: unmarshalledPayload,
    //     },
    //   }),
    // );
  }
  await Promise.all(promised);
};
