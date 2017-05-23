import * as express from "express";
import * as parser from "body-parser";
import * as request from "request-promise";
import * as trueLayer from "./index";
import { IOptions } from "./src/IOptions";
import * as util from "util";

// Get environment varibles
const client_id: string = process.env.client_id;
const client_secret: string = process.env.client_secret;
const redirect_uri: string = process.env.redirect_uri;
const nonce: string = process.env.nonce;
const state: string = process.env.state;
const scope: string = process.env.scope;
const auth_host: string = process.env.auth_host;

// Build 'options' to pass to APIClient
const envVar: IOptions = {
    auth_host,
    client_id,
    client_secret,
    redirect_uri,
    nonce,
    state,
    scope
};

const app = express();
const client = new trueLayer.ApiClient(envVar);
console.log("Me" + util.inspect(client.v1()));

app.get("/", (req, res) => {
  // const authURL = client.auth.getAuthUrl(envVar);
  res.redirect(`https://${auth_host}/?response_type=code&response_mode=form_post&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&nonce=${nonce}&state=${state}&enable_mock=true`);
});

app.use(parser.urlencoded({
  extended: true     // to support URL-encoded bodies
}));

app.post("/truelayer-redirect", async (req, res) => {
  const code: string = req.body.code;

  const jwt = await exchangeCodeForJWT(code);
  res.set("Content-Type", "text/plain");
  res.send(`You sent: ${jwt} to Express`);
});

async function exchangeCodeForJWT(code: string): Promise<string> {

  const options: request.Options = {
    uri: `https://${auth_host}/connect/token`,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "authorization_code",
      client_id,
      client_secret,
      redirect_uri,
      code
    }
  };

  const response: string = await request(options);
  const parsedResponse: any = JSON.parse(response);
  return parsedResponse.access_token;
}

app.listen(5000, () => {
  console.log("Example app listening on port 5000...");
});
