import * as express from "express";
import * as parser from "body-parser";
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
const client = new trueLayer.ApiClient(envVar).v1();
const clientAuth = client.auth;

app.get("/", (req, res) => {
  const authURL = clientAuth.getAuthUrl(envVar);
  res.redirect(authURL);
});

app.use(parser.urlencoded({
  extended: true     // to support URL-encoded bodies
}));

app.post("/truelayer-redirect", async (req, res) => {
  const code: string = req.body.code;

  const tokens = await clientAuth.exchangeCodeForToken(code, envVar);
 // const newToken = await clientAuth.refreshAccessToken(tokens.access_token, envVar); // todo unhandled promise
  res.set("Content-Type", "text/plain");
  res.send(`You sent: ${tokens.access_token} to Express`);
});

app.listen(5000, () => {
  console.log("Example app listening on port 5000...");
});
