import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent } from 'aws-lambda';
import cookie from 'cookie';

const dynamoDbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:8002',
  }),
);

const CONNECTIONS_TABLE = process.env['CONNECTIONS_TABLE'];
if (!CONNECTIONS_TABLE) throw new Error('missing CONNECTIONS_TABLE');

export const connect = async ({
  requestContext: { connectionId },
  headers,
}: APIGatewayProxyEvent) => {
  console.log('HERE1')
  if (!connectionId) throw new Error('missing connectionId');

  const cookieHeader = headers['cookie'] || headers['Cookie'];
  if (!cookieHeader) throw new Error('missing cookie');
  
  const { systemId } = cookie.parse(cookieHeader);
  if (!systemId) throw new Error('missing systemId');

  console.log('HERE2')
  //TODO: Store vins denormalized?
  await dynamoDbClient.send( // TODO: make unique?
    new PutCommand({
      TableName: process.env['CONNECTIONS_TABLE'],
      Item: {
        connectionId,
        systemId,
      },
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify('Listener Connected'),
  };
};
