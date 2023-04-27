import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import express from 'express';
import serverless from 'serverless-http';
import chunk from 'lodash.chunk';

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

app.post('/webhook', async (req, res) => {
  const authorization = req.headers['authorization']; // 3dumHC+4F9N]1[(.YJ8O
  const subscriptionId = req.headers['x-subscription-id'];
  const forwardedFor = req.headers['x-forwarded-for']; // 3.121.20.52, 52.28.216.175, 52.29.162.166

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

  if (batchWrites.length > 0) {
    const chunks = chunk(batchWrites, 25);
    const dbResults = await Promise.all(
      chunks.map((chunk) => {
        const option: BatchWriteCommandInput = {
          RequestItems: {
            [DATAPOINT_TABLE]: chunk.map((v) => ({
              PutRequest: {
                Item: v,
              },
            })),
          },
        };
        return dynamoDbClient.send(new BatchWriteCommand(option));
      }),
    );
    if (
      dbResults.some(
        ({ UnprocessedItems }) => JSON.stringify(UnprocessedItems) !== '{}',
      )
    ) {
      console.error(dbResults);
      throw new Error('UnprocessedItems');
    }
  }

  res.status(200).json({
    status: 'OK',
  });
});
export const handler = serverless(app);
