import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import express from 'express';
import serverless from 'serverless-http';
import { v4 as uuidv4 } from 'uuid';

import { hash } from 'bcrypt';

const SYSTEMS_TABLE_NAME = process.env['SYSTEMS_TABLE'] || '';

const USERS_TABLE_NAME = process.env['USERS_TABLE'] || '';
const JWT_SECRET = process.env['JWT_SECRET'] || '';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const app = express();
app.use(express.json());

// interface System {
//     id: string;
//     name: string;
//     // vins: string[]; //TODO: the actual organisation
//     // selectedDashboardVisualisations: string[]; //TODO: How does the dispatcher know what datapoints need to be send to the frontend?
//     //TODO: maybe another table with the this information?
// }

app.post('/api/systems', async (req, res) => {
  //TODO: validation
  const { name, users } = req.body;
  const system = {
    id: uuidv4(),
    name,
  };
  await dynamoDbClient.send(
    new PutCommand({
      TableName: SYSTEMS_TABLE_NAME,
      Item: system,
    }),
  );

  if (users?.length) {
    for (const user of users) {
      const { Item: userItem } = await dynamoDbClient.send(
        new GetCommand({
          TableName: USERS_TABLE_NAME,
          Key: {
            username: user,
          },
        }),
      );

      if (!userItem) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      if (!userItem['systems']) userItem['systems'] = [];

      userItem['systems'].push(system.id);

      await dynamoDbClient.send(
        new PutCommand({
          TableName: USERS_TABLE_NAME,
          Item: userItem,
        }),
      );
    }
  }

  res.status(201).json(system);
});
app.get('/api/systems', async (req, res) => {
  const systems = await dynamoDbClient.send(
    new ScanCommand({
      TableName: SYSTEMS_TABLE_NAME,
    }),
  );
  //TODO: add pagination

  res.json(systems.Items);
});

export const handler = serverless(app);
