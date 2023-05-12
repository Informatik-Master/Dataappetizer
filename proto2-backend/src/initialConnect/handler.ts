import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
  paginateQuery
} from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import chunk from 'lodash.chunk';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8002',
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const apigatewaymanagementapi = new ApiGatewayManagementApiClient({
  endpoint: 'http://localhost:3001',
});


export const initialConnect = async ({ Records }: any) => {
  console.log('initial connect')
  for (const record of Records) {
    const { dynamodb } = record;

    const payload = dynamodb?.NewImage;
    if (!payload) continue;

    console.log('payload', payload);
    const { connectionId } = unmarshall(payload);

    const { Items: VEHICLES } = await dynamoDbClient.send(
      new ScanCommand({
        TableName: process.env['VEHICLES_TABLE']
      })
    )// TODO: subscription -> get

    console.log('VEHICLES', VEHICLES)

    const v = VEHICLES!.map(async ({vin}) => {
      const paginator = await paginateQuery({
        client: dynamoDbClient,
      },{
          TableName: process.env['DATAPOINT_TABLE'],
          KeyConditionExpression: 'vin = :vin',
          ExpressionAttributeValues: {
            ':vin': vin,
          },
          ScanIndexForward: true,//todo
        } )

        let Items: any[] = [];
        for await (const page of paginator) {
          Items = Items.concat(page.Items);
        }
        // console.log('items', Items)
      return Items!.flatMap((item) => {
        const { vin, datapointName, value } = item;
        return [
          {
            event: datapointName,
            data: {
              vin,
              value: item,
            },
          },
        ];
      });
    });
    const res = (await Promise.all(v)).flat(1);
    console.log('res', res);
    console.log('pushing to connectionId', connectionId);

    await Promise.all(
      chunk(res, 200).map(async (chunk) => {
        try {
          await apigatewaymanagementapi.send(
            new PostToConnectionCommand({
              ConnectionId: connectionId,
              Data: Buffer.from(JSON.stringify(chunk)),
            }),
          );
        } catch (e) {
          console.log(e);
        }
      }),
    );
  }
};
