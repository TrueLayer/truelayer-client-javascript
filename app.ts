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

// Create TrueLayer client instance
const client = new TrueLayer.V1.ApiClient(options);

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
    const authURL = client.auth.getAuthUrl(redirect_uri, scope, "nouce", undefined, true);
    res.redirect(authURL);
});

// Body parser setup
app.use(Parser.urlencoded({
    extended: true
}));

// Receiving post request
app.post("/truelayer-redirect", async (req, res) => {
    const code: string = req.body.code;
    const tokens = await client.auth.exchangeCodeForToken(redirect_uri, code);

    // Info
    const info = await endpointWrapper(client.data.getInfo(tokens.access_token))();
    // Me - Error
    const me = await endpointWrapper(client.data.getMe("bananas"))();
    // Accounts
    const accounts = await endpointWrapper(client.data.getAccounts(tokens.access_token))();
    const accountsList = JSON.parse(accounts).results;
    // Account info - Error
    const accountInfo = await endpointWrapper(client.data.getAccountInfo(tokens.access_token, "banana"))();
    // Transactions
    const transactions = await endpointWrapper(client.data.getTransactions(tokens.access_token, accountsList[0].account_id, "2017-04-20", "2017-04-30"))();
    // Balance
    const balance = await endpointWrapper(client.data.getBalance(tokens.access_token, accountsList[0].account_id))();    /* tslint:disable:no-console */

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
    console.log("Example app listening on port 5000...");
});
