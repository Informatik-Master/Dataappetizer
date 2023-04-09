import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import express from 'express';
import serverless from 'serverless-http';
//
// sls dynamodb start --migrat

const app = express();

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get('/datapoints', async function (req, res) {
  try {
    const { Items } = await dynamoDbClient.send(
      new ScanCommand({
        TableName: process.env['DATAPOINT_TABLE'],
      }),
    );
    res.json(Items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not retreive user' });
  }
});

app.get('/connections', async function (req, res) {
  const { Items } = await dynamoDbClient.send(
    new ScanCommand({
      TableName: process.env['CONNECTIONS_TABLE'],
    }),
  );
  res.json(Items);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});
export const handler = serverless(app);
