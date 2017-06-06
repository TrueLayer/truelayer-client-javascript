const {AuthAPIClient, DataAPIClient} = require("./../..");
const Express = require("express");
const Parser = require("body-parser");
const envalid = require("envalid");
const {str, url} = envalid;

// Get environment variables
const env = envalid.cleanEnv(process.env, {
    CLIENT_ID: str(),
    CLIENT_SECRET: str(),
    REDIRECT_URI: url({default: "http://localhost:5000/truelayer-redirect"})
});

// Create an array of scopes
const scope = [
    "offline_access",
    "info",
    "accounts",
    "transactions",
    "balance"
];

// Create TrueLayer client instance
const client = new AuthAPIClient({
    client_id: env.CLIENT_ID,
    client_secret: env.CLIENT_SECRET
});

// Create Express instance
const app = Express();

// Redirect to the auth server
app.get("/", (req, res) => {
    const authURL = client.getAuthUrl(env.REDIRECT_URI, scope, "nonce", state = "", true);
    res.redirect(authURL);
});

// Body parser setup
app.use(Parser.urlencoded({ extended: true }));

// Receiving post request
app.post("/truelayer-redirect", async (req, res) => {
    const code = req.body.code;
    const tokens = await client.exchangeCodeForToken(env.REDIRECT_URI, code);

    // Info
    const info = await DataAPIClient.getInfo(tokens.access_token);
    // Me - Error
    const me = await DataAPIClient.getMe(tokens.access_token);
    // Accounts
    const accounts = await DataAPIClient.getAccounts(tokens.access_token);
    const accountsList = accounts.results;
    // Account info - Error
    const accountInfo = await DataAPIClient.getAccount(tokens.access_token, accountsList[0].account_id);
    // Transactions
    const transactions = await DataAPIClient.getTransactions(tokens.access_token, accountsList[0].account_id, "2017-04-20", "2017-04-30");
    // Balance
    const balance = await DataAPIClient.getBalance(tokens.access_token, accountsList[0].account_id);

    console.log("Info: " + JSON.stringify(info));
    console.log("Me: " + JSON.stringify(me));
    console.log("Accounts: " + JSON.stringify(accounts));
    console.log("Account: " + JSON.stringify(accountInfo));
    console.log("Transactions: " + JSON.stringify(transactions));
    console.log("Balance: " + JSON.stringify(balance));

    res.set("Content-Type", "text/plain");
    res.send(`Access Token:   ${JSON.stringify(tokens.access_token)}
            Refresh Token:  ${JSON.stringify(tokens.refresh_token)}`);
});

app.listen(5000, () => {
    console.log("Example app listening on port 5000...");
});
