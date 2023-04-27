import express from 'express';
import serverless from 'serverless-http';

const app = express();
app.use(express.json());


app.post('/webhook', async (req, res) => {
    const authorization = req.headers['authorization'] // 3dumHC+4F9N]1[(.YJ8O
    const subscriptionId = req.headers['x-subscription-id']
    const forwardedFor = req.headers['x-forwarded-for'] //

  res.status(200).json({
            status: 'OK'
        });
});
export const handler = serverless(app);

