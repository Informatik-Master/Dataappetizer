import express from 'express';
import serverless from 'serverless-http';
import { sign } from 'jsonwebtoken';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

import {compare, hash} from 'bcrypt'

const JWT_SECRET = process.env['JWT_SECRET'] || '';

const app = express();
app.use(express.json());

const client = new DynamoDBClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:8002',
  });
  const dynamoDbClient = DynamoDBDocumentClient.from(client);
  

const USERS_TABLE_NAME = process.env['USERS_TABLE'];
if (!USERS_TABLE_NAME) throw new Error('USERS_TABLE_NAME not set');

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

    const {Item: user} = await dynamoDbClient.send(
        new GetCommand({
            TableName: USERS_TABLE_NAME,
            Key: {
                username: username,
            },
        }),
    );

    if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    const valid = await compare(password, user['password']);
    if (!valid) {
        res.status(401).json({ message: 'Invalid password' });
        return;
    }

    //TODO: change flow
    const token = sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    const {Item: user} = await dynamoDbClient.send(
        new GetCommand({
            TableName: USERS_TABLE_NAME,
            Key: {
                username: username,
            },
        }),
    );

    if (user) {
        res.status(401).json({ message: 'User already exists' });
        return;
    }

    const hashedPassword = await hash(password, 10);
    
    await dynamoDbClient.send(
        new PutCommand({
            TableName: USERS_TABLE_NAME,
            Item: {
                username: username,
                password: hashedPassword,
            },
        }),
    );

    res.status(201).json({ message: 'User created' });
});

app.get('/api/users', async (req, res) => {
    //TODO: protect this route and the systems and the websocket
    const users = await dynamoDbClient.send(
        new ScanCommand({
            TableName: USERS_TABLE_NAME,
        }),

    );

    res.json(users.Items);
});

export const handler = serverless(app);
