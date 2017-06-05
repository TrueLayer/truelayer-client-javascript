const TrueLayer = require("./..");
const Express = require("express");
const Parser = require("body-parser");

// Get environment varibles
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const redirect_uri = process.env.redirect_uri;

// Build 'options' to pass to APIClient
const options = {
    client_id,
    client_secret
};

// Create an array of scopes
const scope = [
    "offline_access",
    "info",
    "accounts",
    "transactions",
    "balance"
];

// Create TrueLayer client instance
const client = new TrueLayer.V1.Client(options);

// Create Express instance
const app = Express();

// Redirect to the auth server
app.get("/", (req, res) => {
    const authURL = client.auth.getAuthUrl(redirect_uri, scope, "nouce", state = "", true);
    res.redirect(authURL);
});

// Body parser setup
app.use(Parser.urlencoded({ extended: true }));

// Receiving post request
app.post("/truelayer-redirect", async (req, res) => {
    const code = req.body.code;
    const tokens = await client.auth.exchangeCodeForToken(redirect_uri, code);

    // Info
    const info = await client.data.getInfo(tokens.access_token);
    // Me - Error
    const me = await client.data.getMe(tokens.access_token);
    // Accounts
    const accounts = await client.data.getAccounts(tokens.access_token);
    const accountsList = accounts.results;
    // Account info - Error
    const accountInfo = await client.data.getAccount(tokens.access_token, accountsList[0].account_id);
    // Transactions
    const transactions = await client.data.getTransactions(tokens.access_token, accountsList[0].account_id, "2017-04-20", "2017-04-30");
    // Balance
    const balance = await client.data.getBalance(tokens.access_token, accountsList[0].account_id);

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
