import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import express from 'express';
import serverless from 'serverless-http';
import chunk from 'lodash.chunk';
import { LRUCache } from 'lru-cache';

const SYSTEM_CACHE = new LRUCache({
  max: 100,
  ttl: 60_000,
});

const DATAPOINT_TABLE = process.env['DATAPOINT_TABLE'];
if (!DATAPOINT_TABLE) throw new Error('missing DATAPOINT_TABLE');
const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const app = express();
app.use(express.json());

type CarusoApiPushData = {
  forwardedAt: string;
  transactionId: string;
  subscriptionId: string;
  inVehicleResponse: {
    version: '1.0';
    inVehicleData: (
      | {
          response: {
            [key: string]:
              | {
                  dataPoint: {
                    timestamp: string;
                    [key: string]: any;
                  };
                }
              | {
                  error: {
                    code: string;
                    message: string;
                  };
                };
          };
          identifier: {
            type: 'VIN'; // currently only vin supported https://dev.caruso-dataplace.com/api/reference/#operation/inVehicleDelivery/get
            value: string;
          };
        }
      | {
          error: {
            code: string;
            message: string;
          };
          identifier: {
            type: 'VIN'; // currently only vin supported https://dev.caruso-dataplace.com/api/reference/#operation/inVehicleDelivery/get
            value: string;
          };
        }
    )[];
  };
  deliveredAt: string;
};

type DatabaseItem = {
  vin: string;
  timestamp: number;
  datapointName: string;
  vinWithDataPointName: string;
  value: any;
};

app.post('/webhook/:systemId', async (req, res) => {
  const systemId = req.params['systemId'];

  let system = SYSTEM_CACHE.get(systemId) as Record<string, any> | undefined;
  if (!system) {
    const { Item: loadedSystem } = await dynamoDbClient.send(
      new GetCommand({
        TableName: process.env['SYSTEMS_TABLE'],
        Key: {
          id: systemId,
        },
      }),
    );
    system = loadedSystem;
    if (!system) throw new Error('System not found');
    SYSTEM_CACHE.set(systemId, system);
  }

  if (system['secret'] !== req.headers['authorization'])
    throw new Error('Incorrect secret');

  const body = req.body as CarusoApiPushData;
  if (!body) throw new Error('No body');

  const batchWrites: DatabaseItem[] = [];
  for (const inVehicleData of body.inVehicleResponse.inVehicleData) {
    if ('error' in inVehicleData) {
      console.error(inVehicleData.error);
      throw new Error(inVehicleData.error.message);
    }
    for (const [datapointName, datapointValue] of Object.entries(
      inVehicleData.response,
    )) {
      const vin = inVehicleData.identifier.value;
      if ('error' in datapointValue) {
        console.error(datapointValue.error);
        throw new Error(datapointValue.error.message);
      }

      batchWrites.push({
        vin,
        timestamp: Date.parse(datapointValue.dataPoint.timestamp),
        datapointName,
        vinWithDataPointName: `${vin}#${datapointName}`,
        value: datapointValue.dataPoint,
      });
    }
  }

  if (batchWrites.length) {
    const chunks = chunk(batchWrites, 25);
    const dbResults = await Promise.all(
      chunks.map(async (chunk) => {
        const option: BatchWriteCommandInput = {
          RequestItems: {
            [DATAPOINT_TABLE]: chunk.map((v) => ({
              PutRequest: {
                Item: v,
              },
            })),
          },
        };
        await dynamoDbClient.send(new BatchWriteCommand(option));

        for (const item of chunk) {
          //TODO:
          await dynamoDbClient.send(
            new PutCommand({
              TableName: process.env['VEHICLES_TABLE'],
              Item: {
                vin: item.vin,
                subscriptionId: body.subscriptionId,
              },
            }),
          );
        }
      }),
    );
    // if ( //TODO:
    //   dbResults.some(
    //     ({ UnprocessedItems }) => JSON.stringify(UnprocessedItems) !== '{}',
    //   )
    // ) {
    //   console.error(dbResults);
    //   throw new Error('UnprocessedItems');
    // }
  }

  res.status(200).json({
    status: 'OK',
  });
});
export const handler = serverless(app);
