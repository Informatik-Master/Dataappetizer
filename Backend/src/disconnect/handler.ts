import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

export const disconnect = async ({ requestContext }: any) => {
  const { connectionId } = requestContext;
  if (!connectionId) {
    // TODO: When ist this the case?
    throw new Error('missing connectionId');
  }
  console.log('disconnecting', connectionId);
  await dynamoDbClient.send(
    new DeleteCommand({
      TableName: process.env['CONNECTIONS_TABLE'],
      Key: {
        connectionId,
      },
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify('Listener Disconnected'),
  };
};
