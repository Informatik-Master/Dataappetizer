import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  paginateScan,
} from '@aws-sdk/lib-dynamodb';
import express from 'express';
import serverless from 'serverless-http';

const app = express();

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get('/api/debug/datapoints', async function (req, res) {
  const paginator = await paginateScan(
    {
      client: dynamoDbClient,
    },
    {
      TableName: process.env['DATAPOINT_TABLE'],
    },
  );

  let Items: any[] = [];
  for await (const page of paginator) {
    if (page.Items === undefined) continue;
    Items.push(...page.Items);
  }

  res.json(Items);
});

app.get('/api/debug/datapoints-vin', async function (req, res) {
  let vin = req.query['vin']?.toString()!;
  const { Items } = await dynamoDbClient.send(
    new QueryCommand({
      TableName: process.env['DATAPOINT_TABLE'],
      ScanIndexForward: false,
      KeyConditionExpression: 'vin = :vin',
      ExpressionAttributeValues: {
        ':vin': vin,
      },
      // Limit: 1,
    }),
  );
  res.json(Items);
});

app.get('/api/debug/datapoints-vin-latest', async function (req, res) {
  const dataPoints = ['geolocation', 'mileage'];
  let vin = req.query['vin']?.toString()!;

  const queries = dataPoints.map(async (dataPoint) => {
    const searchKey = `${vin}#${dataPoint}`;
    return dynamoDbClient.send(
      new QueryCommand({
        TableName: process.env['DATAPOINT_TABLE'],
        IndexName: process.env['DATAPOINT_TABLE_DATAPOINT_INDEX'],
        ScanIndexForward: false,
        KeyConditionExpression: 'vinWithDataPointName = :searchKey',
        ExpressionAttributeValues: {
          ':searchKey': searchKey,
        },
        Limit: 1,
      }),
    );
  });

  res.json((await Promise.all(queries)).flatMap((v) => v.Items));
});

app.get('/api/debug/vehicles', async function (req, res) {
  const { Items } = await dynamoDbClient.send(
    new ScanCommand({
      TableName: process.env['VEHICLES_TABLE'],
    }),
  );
  res.json(Items);
});

app.get('/api/debug/connections', async function (req, res) {
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
