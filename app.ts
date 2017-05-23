import * as TrueLayer from './index'

import * as express from 'express';
import * as parser from 'body-parser';
import * as request from 'request-promise';

// Get environment varibles
const client_id: string = process.env.client_id;
const client_secret: string = process.env.client_secret;
const redirect_uri: string = process.env.redirect_uri;
const nonce: string = process.env.nonce;
const state: string = process.env.state;
const scope: string = process.env.scope;
const auth_host: string = process.env.scope;

// Build 'options' to pass to APIClient
const options: TrueLayer.IOptions = {
    auth_host,
    client_id,
    client_secret,
    redirect_uri,
    nonce,
    state,
    scope
}

const app = express();

// TODO: APIClient class

app.get('/', (req, res) => {
  res.redirect(`https://${auth_host}/?response_type=code&response_mode=form_post&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&nonce=${nonce}&state=${state}&enable_mock=true`)
})

app.use(parser.urlencoded({
  extended: true     // to support URL-encoded bodies
}));

app.post('/truelayer-redirect', async (req, res) => {
  const code: string = req.body.code;
  console.log(code);

  const jwt = await exchangeCodeForJWT(code);
  console.log(jwt);
  res.set('Content-Type', 'text/plain');
  res.send(`You sent: ${jwt} to Express`);
});

async function exchangeCodeForJWT(code: string): Promise<string> {

  const options: request.Options = {
    uri: `https://${auth_host}/connect/token`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      'grant_type': 'authorization_code',
      'client_id': client_id,
      'client_secret': client_secret,
      'redirect_uri': redirect_uri,
      'code': code
    }
  };

  const response: string = await request(options);
  const parsedResponse: any = JSON.parse(response);
  console.log(response);
  return parsedResponse.access_token;
  // await request(options)
  //   .then((parsedBody) => {
  //     return parsedBody.access_token;
  //   })
  //   .catch((error) => {
  //     return "Error, cannot parse jwt."
  //   });
}

app.listen(5000, function () {
  console.log('Example app listening on port 5000...')
});


