// Truelayer clients
const { AuthAPIClient, DataAPIClient } = require("./../..");
const Express = require("express");
const Parser = require("body-parser");
const envalid = require("envalid");
const { str, url } = envalid;

// Get environment variables
const env = envalid.cleanEnv(process.env, {
    CLIENT_ID: str(),
    CLIENT_SECRET: str(),
    REDIRECT_URI: url({ default: "http://localhost:5000/truelayer-redirect" })
});

// Create TrueLayer client instance
const authClient = new AuthAPIClient({
    client_id: env.CLIENT_ID, 
    client_secret: env.CLIENT_SECRET 
});

// Create an array of scopes
const scopes = ["offline_access", "info", "accounts", "transactions", "balance"];

// Create Express instance
const app = Express();

// Redirect to the auth server
app.get("/", (req, res) => {
    const authURL = authClient.getAuthUrl(env.REDIRECT_URI, scopes, "nonce", state = "foo", true);
    res.redirect(authURL);
});

// Body parser setup
app.use(Parser.urlencoded({ extended: true }));

// Receiving post request
app.post("/truelayer-redirect", async (req, res) => {
    const code = req.body.code;
    const tokens = await authClient.exchangeCodeForToken(env.REDIRECT_URI, code);

    // Info
    const info = await DataAPIClient.getInfo(tokens.access_token);
    // Me
    const me = await DataAPIClient.getMe(tokens.access_token);
    // Accounts
    const accounts = await DataAPIClient.getAccounts(tokens.access_token);
    const accountsList = accounts.results;
    // Account info
    const accountInfo = await DataAPIClient.getAccount(tokens.access_token, accountsList[0].account_id);
    // Transactions
    const transactions = await DataAPIClient.getTransactions(tokens.access_token, accountsList[0].account_id, "2017-01-20", "2017-04-30");
    // Balance
    const balance = await DataAPIClient.getBalance(tokens.access_token, accountsList[0].account_id);

    res.set("Content-Type", "text/plain");
    res.send(
        "Access Token: " + JSON.stringify(tokens.access_token, null, 2) + "\n\n" +
        "Refresh Token: " + JSON.stringify(tokens.refresh_token, null, 2) + "\n\n" +
        "Info: " + JSON.stringify(info, null, 2) + "\n\n" +
        "Me: " + JSON.stringify(me, null, 2) + "\n\n" +
        "Accounts: " + JSON.stringify(accounts, null, 2) + "\n\n" +
        "Account: " + JSON.stringify(accountInfo, null, 2) + "\n\n" +
        "Transactions: " + JSON.stringify(transactions, null, 2) + "\n\n" +
        "Balance: " + JSON.stringify(balance, null, 2));
});

app.listen(5000, () => {
    console.log("Example app listening on port 5000...");
});
