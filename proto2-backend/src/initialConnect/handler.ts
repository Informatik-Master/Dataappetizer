import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  paginateQuery,
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

const sendAllKnownDataForVehicle = async (
  vin: string,
  connectionId: string,
) => {
  const paginator = await paginateQuery(
    {
      client: dynamoDbClient,
    },
    {
      TableName: process.env['DATAPOINT_TABLE'],
      KeyConditionExpression: 'vin = :vin',
      ExpressionAttributeValues: {
        ':vin': vin,
      },
      ScanIndexForward: true,
    },
  );

  for await (const page of paginator) {
    const vehicleBatch = page.Items!.map((item) => {
      const { vin, datapointName, value } = item;
      return {
        event: datapointName,
        data: {
          vin,
          value: item,
        },
      };
    });

    await Promise.all(
      chunk(vehicleBatch, 200).map(async (miniBatch) => {
        //TODO: does order mater?
        try {
          await apigatewaymanagementapi.send(
            new PostToConnectionCommand({
              ConnectionId: connectionId,
              Data: Buffer.from(JSON.stringify(miniBatch)),
            }),
          );
        } catch (e) {
          console.log(e);
        }
      }),
    );
  }
};

export const initialConnect = async ({ Records }: any) => {
  console.log('initial connect');
  for (const record of Records) {
    const { dynamodb } = record;

    const payload = dynamodb?.NewImage;
    if (!payload) continue;

    console.log('payload', payload);
    const { connectionId } = unmarshall(payload);

    const { Items: VEHICLES } = await dynamoDbClient.send(
      new ScanCommand({
        TableName: process.env['VEHICLES_TABLE'],
      }),
    ); // TODO: subscription -> get

    await Promise.all(
      VEHICLES!.map(({ vin }) => sendAllKnownDataForVehicle(vin, connectionId)),
    );
  }
};
