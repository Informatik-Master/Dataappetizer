import {
  ApiGatewayManagementApiClient,
  GetConnectionCommand,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
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
  

  



  const promised = [];
  for (const record of Records) {
    const { dynamodb } = record;

    const payload = dynamodb?.NewImage;
    if (!payload) continue;

    const unmarshalledPayload = unmarshall(payload);
    const vin = unmarshalledPayload['vin'];

    // TODO: This is absolutely not the way to do this :D
    const { Items: VehicleEntries } = await dynamoDbClient.send(
      new QueryCommand({
        TableName: process.env['VEHICLES_TABLE'],
        KeyConditionExpression: 'vin = :vin',
        ExpressionAttributeValues: {
          ':vin': vin,
        },
      }),
    );
    if(!VehicleEntries) continue;

    const systems = (await Promise.all(VehicleEntries.map(async ({subscriptionId})=> {
      const { Items: Systems } = await dynamoDbClient.send(
        new QueryCommand({
          TableName: process.env['SYSTEMS_TABLE'],
          IndexName: process.env['SYSTEMS_TABLE_SUBSCRIPTION_ID_INDEX'],
          KeyConditionExpression: 'subscriptionId = :subscriptionId',
          ExpressionAttributeValues: {
            ':subscriptionId': subscriptionId,
          },
        }),
      );
      return Systems
    }))).flat();

    const connections = (await Promise.all(systems.map(async (system)=> {
      const { Items: Connection } = await dynamoDbClient.send(
       new QueryCommand({
          TableName: process.env['CONNECTIONS_TABLE'],
          IndexName: process.env['CONNECTIONS_TABLE_SYSTEM_INDEX'],
          KeyConditionExpression: 'systemId = :systemId',
          ExpressionAttributeValues: {
            ':systemId': system!['id'],
          },
        }),
      );
      return Connection
    }))).flat();
    


    const sendToAll = async (bufferData: {
      event: string;
      data: Record<string, any>;
    }) =>
    connections!.map(async (item) => {
        try {
          const gatewayResponse = await apigatewaymanagementapi.send(
            // what happens if the connection is closed?
            new PostToConnectionCommand({
              ConnectionId: item!['connectionId'],
              Data: Buffer.from(JSON.stringify(bufferData)),
            }),
          );
          return gatewayResponse;
        } catch (e) {
          console.log(e);
        }
        return null;
      });

      promised.push(
        sendToAll({
          event: unmarshalledPayload['datapointName'],
          data: {
            vin,
            value: unmarshalledPayload,
          },
        }),
      );

  }
  await Promise.allSettled(promised);
};
