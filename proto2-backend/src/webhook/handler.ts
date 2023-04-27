import { APIGatewayProxyEvent, Context } from "aws-lambda"

export const handler = async (event: APIGatewayProxyEvent, context: Context) => { //TODO: express

    const authorization = event.headers['authorization'] // 3dumHC+4F9N]1[(.YJ8O
    const subscriptionId = event.headers['x-subscription-id']
    const forwardedFor = event.headers['x-forwarded-for'] // 3.121.20.52, 52.28.216.175, 52.29.162.166


    const body = JSON.parse(event.body!)
    console.log(event)
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'OK'
        })
    }
}