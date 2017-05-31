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
    client_secret
};

// Create an array of scopes
const scope: string[] = [
    "offline_access",
    "info",
    "accounts",
    "transactions",
    "balance"
];

const client = new TrueLayer.V1.ApiClient(options);
const clientAuth = client.auth;
const clientData = client.data;

// Create Express instance
const app = Express();

/**
 * Wrapper function that deals with try/catch blocks
 * @param f - TrueLayer endpoint method
 * @returns {()=>Promise<TrueLayer.IResponse<T>|any>}
 */
function endpointWrapper<T>(f: Promise<TrueLayer.IResponse<T>>) {
    return async () => {
        try {
            return await f;
        } catch (error) {
            return error;
        }
    };
}

// Redirect to the auth server
app.get("/", (req, res) => {
// TODO: can it access a different uri?
  const authURL = clientAuth.getAuthUrl(redirect_uri, scope, "abc", undefined, true);
  res.redirect(authURL);
});

// Body parser setup
app.use(Parser.urlencoded({
  extended: true
}));

// Receiving post request
app.post("/truelayer-redirect", async (req, res) => {
  const code: string = req.body.code;
  const tokens = await clientAuth.exchangeCodeForToken(redirect_uri, code);
  clientAuth.isTokenExpired(tokens.access_token);
  clientAuth.timeBeforeExpired(tokens.access_token);

  // Info
  const info = await endpointWrapper(clientData.getInfo(tokens.access_token))();
  // Me - Error
  const me = await endpointWrapper(clientData.getMe("bananas"))();
  // Accounts
  const accounts = await endpointWrapper(clientData.getAccounts(tokens.access_token))();
  const accountsList = JSON.parse(accounts).results;
  // Account info - Error
  const accountInfo = await endpointWrapper(clientData.getAccountInfo(tokens.access_token, "banana"))();
  // Transactions
  const transactions = await endpointWrapper(clientData.getTransactions(tokens.access_token, accountsList[0].account_id, "2017-04-20", "2017-04-30"))();
  // Balance
  const balance = await endpointWrapper(clientData.getBalance(tokens.access_token, accountsList[0].account_id))();

  /* tslint:disable:no-console */
  console.log("Info " + info);
  console.log("Me ERROR" + me);
  console.log("Accounts " + accounts);
  console.log("Account info ERROR" + accountInfo);
  console.log("transactions " + transactions);
  console.log("balance " + balance);

  res.set("Content-Type", "text/plain");
  res.send(`Access Token:   ${JSON.stringify(tokens.access_token)}
            Refresh Token:  ${JSON.stringify(tokens.refresh_token)}`);
});

app.listen(5000, () => {
  // console.log("Example app listening on port 5000...");
});
