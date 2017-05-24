import * as express from "express";
import * as parser from "body-parser";
import * as trueLayer from "./index";
import IOptions from "./src/IOptions";

// Get environment varibles
const client_id: string = process.env.client_id;
const client_secret: string = process.env.client_secret;
const redirect_uri: string = process.env.redirect_uri;
// const nonce: string = process.env.nonce;
// const state: string = process.env.state;
// const scope: string = process.env.scope;

// Build 'options' to pass to APIClient
const options: IOptions = {
    client_id,
    client_secret,
    redirect_uri
};

const client = new trueLayer.V1.ApiClient(options);
const clientAuth = client.auth;
const clientData = client.data;

const app = express();

// Redirect to the auth server
app.get("/", (req, res) => {
  const authURL = clientAuth.getAuthUrl();
  res.redirect(authURL);
});

// Body parser setup
app.use(parser.urlencoded({
  extended: true
}));

// Recieving post request
app.post("/truelayer-redirect", async (req, res) => {
  const code: string = req.body.code;
  const tokens = await clientAuth.exchangeCodeForToken(code);
  // console.log("access token: " + tokens.access_token);
  // console.log("refresh token: " + tokens.refresh_token);
  const newTokens = await clientAuth.refreshAccessToken(tokens.refresh_token);
  // console.log("new access token: " + newTokens.access_token);
  // console.log("new refresh token: " + newTokens.refresh_token);
  res.set("Content-Type", "text/plain");
  res.send(`You sent: ${newTokens.access_token} to Express`);
});

app.listen(5000, () => {
  console.log("Example app listening on port 5000...");
});
