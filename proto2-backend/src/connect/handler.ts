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
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

export const connect = async ({
  requestContext: { connectedAt, connectionId },
  headers,
}: any) => {
  console.log('Connecting', connectionId, headers);
  if (!connectionId) {
    // TODO: When ist this the case?
    throw new Error('missing connectionId');
  }

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
