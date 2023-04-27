import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  QueryCommand,
  DynamoDBDocumentClient,
  PutCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const CONNECTIONS_TABLE = process.env['CONNECTIONS_TABLE'];
if (!CONNECTIONS_TABLE) {
  throw new Error('missing CONNECTIONS_TABLE');
}

export const connect = async ({
  requestContext: { connectedAt, connectionId },
  headers, //TODO: X-System-ID => and then store the SystemId or the relevant vins
}: any) => {
  console.log('Connecting', connectionId, headers);
  if (!connectionId) {
    // TODO: When ist this the case?
    throw new Error('missing connectionId');
  }

  console.log('systemId', headers['x-system-id']);//TODO: Besser token

  // new BatchWriteCommand({
  //   RequestItems: {
  //     [CONNECTIONS_TABLE]: [
  //       {
  //         PutRequest: {
  //           Item: {
  //             connectionId,
  //             connectedAt,
  //           },
  //         },
  //       },
  //     ],
  //   },
  // });

  console.log('pre');
  await dynamoDbClient.send(
    new PutCommand({
      TableName: process.env['CONNECTIONS_TABLE'],
      Item: {
        connectionId,
        // connectedAt,
      },
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify('Listener Connected'),
  };
};
