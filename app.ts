import * as Express from "express";
import * as Parser from "body-parser";
import * as TrueLayer from "./index";
import { ApiError } from "./src/V1/errors";

// Get environment variables
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const redirect_uri = process.env.redirect_uri;

// Build 'options' to pass to client
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
    const authURL = client.auth.getAuthUrl(redirect_uri, scope, "nonce", "bar", true);
    res.redirect(authURL);
});

// Body parser setup
app.use(Parser.urlencoded({ extended: true }));

// timeout used to test network failure errors
function sleep(ms = 0) {
    return new Promise((r) => setTimeout(r, ms));
}

// Receiving post request
app.post("/truelayer-redirect", async (req, res) => {
    const code = req.body.code;

    // test network failure errors
    // await sleep(10000);

    const tokens = await client.auth.exchangeCodeForToken(redirect_uri, code);

    // Info
    try {
        const info = await client.data.getInfo(tokens.access_token);
        console.log("Call to /info API " + JSON.stringify(info));
    } catch (error) {
        console.log("Error on /info API " + error);
        throw error;
    }

    // Me - Error
    try {
        const me = await client.data.getMe(tokens.access_token);
        console.log("Call to /me API " + JSON.stringify(me));
    } catch (error) {
        console.log("Error on /me API " + error);
        throw error;
    }

    // Accounts
    try {
        const accounts = await client.data.getAccounts(tokens.access_token);
        const accountsList = accounts.results;
        const accountId = accountsList[0].account_id;
        console.log("Call to /accounts API " + JSON.stringify(accountsList));

        // Account info
        try {
            const accountInfo = await client.data.getAccount(tokens.access_token, accountId);
            console.log("Call to /account/" + accountId + "/ " + JSON.stringify(accountInfo));
        } catch (error) {
            console.log("Error on /account/" + accountId + "/ " + error);
            throw error;
        }

        // Transactions
        try {
            const transactions = await client.data.getTransactions(tokens.access_token, accountId, "2000-04-20", "2017-04-30");
            console.log("Call to /transactions API " + JSON.stringify(transactions));
        } catch (error) {
            console.log("Error on /transactions " + error);
            throw error;
        }

        // Balance
        try {
            const balance = await client.data.getBalance(tokens.access_token, accountId);
            console.log("Call to /balance API " + JSON.stringify(balance));
        } catch (error) {
            console.log("Error on /balance " + error);
            throw error;
        }
    } catch (error) {
        console.log("Error on /accounts API " + error);
        throw error;
    }

    res.set("Content-Type", "text/plain");
    res.send(`Access Token:   ${JSON.stringify(tokens.access_token)}
            Refresh Token:  ${JSON.stringify(tokens.refresh_token)}`);
});

app.listen(5000, () => {
    console.log("Example app listening on port 5000...");
});
