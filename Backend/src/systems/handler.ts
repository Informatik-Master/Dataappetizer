import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { cryptoRandomStringAsync } from 'crypto-random-string';
import express from 'express';
import serverless from 'serverless-http';
import { v4 as uuidv4 } from 'uuid';

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

app.put('/api/systems', async (req, res) => {
  const { name, users, dashboardConfig, detailConfig, subscriptionId, id } =
    req.body;
  if (!id) {
    res.status(400).json({ message: 'Missing id' });
    return;
  }

  const { Item: systemItem } = await dynamoDbClient.send(
    new GetCommand({
      TableName: SYSTEMS_TABLE_NAME,
      Key: {
        id,
      },
    }),
  );

  if (!systemItem) {
    res.status(404).json({ message: 'System not found' });
    return;
  }

  if (name) systemItem['name'] = name;
  if (users) systemItem['users'] = users;
  if (dashboardConfig) systemItem['dashboardConfig'] = dashboardConfig;
  if (detailConfig) systemItem['detailConfig'] = detailConfig;
  if (subscriptionId) systemItem['subscriptionId'] = subscriptionId;

  await dynamoDbClient.send(
    new PutCommand({
      TableName: SYSTEMS_TABLE_NAME,
      Item: systemItem,
    }),
  );

  res.status(200).json(systemItem);
});

app.post('/api/systems', async (req, res) => {
  //TODO: validation
  const { name, users, dashboardConfig, detailConfig, subscriptionId } =
    req.body;

  const system = {
    id: uuidv4(),
    name,
    users,
    dashboardConfig,
    detailConfig,
    subscriptionId,
    secret: await cryptoRandomStringAsync({
      length: 10,
      type: 'ascii-printable',
    }),
  };

  // Transaction?
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
            email: user,
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
  // console.log(process.env)
  // res.json(JSON.stringify(process.env['API_URL']))
});

app.get('/api/systems/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: 'Missing id' });
    return;
  }
  const system = await dynamoDbClient.send(
    new GetCommand({
      TableName: SYSTEMS_TABLE_NAME,
      Key: {
        id: req.params.id,
      },
    }),
  );
  if (!system.Item) {
    res.status(404).json({ message: 'System not found' });
    return;
  }
  res.json(system.Item);
});

export const handler = serverless(app);
