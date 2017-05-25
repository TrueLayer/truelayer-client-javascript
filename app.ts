import * as Express from "express";
import * as Parser from "body-parser";
import * as TrueLayer from "./index";

// Get environment varibles
const client_id: string = process.env.client_id;
const client_secret: string = process.env.client_secret;
const redirect_uri: string = process.env.redirect_uri;

// Build 'options' to pass to APIClient
const options: TrueLayer.IOptions = {
    client_id,
    client_secret,
    redirect_uri
};

const client = new TrueLayer.V1.ApiClient(options);
const clientAuth = client.auth;
const clientData = client.data;

// Create Express instance
const app = Express();

// Redirect to the auth server
app.get("/", (req, res) => {
  const authURL = clientAuth.getAuthUrl("offline_access info accounts transactions balance", "abc", true);
  res.redirect(authURL);
});

// Body parser setup
app.use(Parser.urlencoded({
  extended: true
}));

// Receiving post request
app.post("/truelayer-redirect", async (req, res) => {
  const code: string = req.body.code;
  const tokens: TrueLayer.IAccessTokens = await clientAuth.exchangeCodeForToken(code);
  // console.log("access token: " + tokens.access_token);
  // console.log("refresh token: " + tokens.refresh_token);
  // const newTokens = await clientAuth.refreshAccessToken(tokens.refresh_token);
  // console.log("new access token: " + newTokens.access_token);
  // console.log("new refresh token: " + newTokens.refresh_token);
  const info: TrueLayer.IResponse<TrueLayer.IInfo> = await clientData.info(tokens.access_token);
  const me: TrueLayer.IResponse<TrueLayer.IMe> = await clientData.me(tokens.access_token);

  const accounts: TrueLayer.IResponse<TrueLayer.IAccount> = await clientData.accounts(tokens.access_token);
  const accountsList: [TrueLayer.IAccount] = accounts.results as [TrueLayer.IAccount];

  const accountInfo: TrueLayer.IResponse<TrueLayer.IAccount> = await clientData.accountInfo(tokens.access_token, accountsList[0].account_id);
  const transactions: TrueLayer.IResponse<TrueLayer.ITransaction> = await clientData.transactions(tokens.access_token, accountsList[0].account_id);
  const balance: TrueLayer.IResponse<TrueLayer.IBalance> = await clientData.balance(tokens.access_token, accountsList[0].account_id);
  /* tslint:disable:no-console */
  console.log("Info " + JSON.stringify(info));
  console.log("Me " + JSON.stringify(me));
  console.log("Accounts " + JSON.stringify(accounts));
  console.log("Account info " + JSON.stringify(accountInfo));
  console.log("transactions " + JSON.stringify(transactions));
  console.log("balance " + JSON.stringify(balance));

  res.set("Content-Type", "text/plain");
  res.send(`You sent: ${JSON.stringify(tokens.access_token)} to Express`);
});

app.listen(5000, () => {
  // console.log("Example app listening on port 5000...");
});
