import test from "ava";
import * as TrueLayer from "./../../index";

// Get access token from environment variable
const access_token: string = process.env.access_token;

// Dummy values
const clientId: string = "test";
const clientSecret: string = "secret";
const redirectUri: string = "http://localhost:5000/truelayer-redirect";

// Build 'options' to pass to APIClient
const options: TrueLayer.IOptions = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri
};

// Setup the client with dummy options
const client = new TrueLayer.V1.ApiClient(options);
const clientData = client.data;

test("Get from /me returns success", async (t) => {
    t.plan(1);
    const response: TrueLayer.IResponse<TrueLayer.IMe> = await clientData.getMe(access_token);
    t.true(response.success);
});

test("Get from /info returns success", async (t) => {
    t.plan(1);
    const response: TrueLayer.IResponse<TrueLayer.IInfo> = await clientData.getInfo(access_token);
    t.true(response.success);
});

test("Get from /accounts returns success", async (t) => {
    t.plan(1);
    const response: TrueLayer.IResponse<TrueLayer.IAccount> = await clientData.getAccounts(access_token);
    t.true(response.success);
});

test("Get from /acccounts returns success for each result account", async (t) => {
    const resp: TrueLayer.IResponse<TrueLayer.IAccount> = await clientData.getAccounts(access_token);
    const accounts: [TrueLayer.IAccount] = resp.results as [TrueLayer.IAccount];
    const assertions: number = accounts.length;
    t.plan(assertions);

    for (const account of accounts) {
        const response: TrueLayer.IResponse<TrueLayer.IAccount> = await clientData.getAccountInfo(access_token, account.account_id);
        t.true(response.success);
    }
});

test("Get from /accounts/{id}/transactions returns success for each result account", async (t) => {
    const resp: TrueLayer.IResponse<TrueLayer.IAccount> = await clientData.getAccounts(access_token);
    const accounts: [TrueLayer.IAccount] = resp.results as [TrueLayer.IAccount];
    const assertions: number = accounts.length;
    t.plan(assertions);

    for (const account of accounts) {
        const response: TrueLayer.IResponse<TrueLayer.ITransaction> = await clientData.getTransactions(access_token, account.account_id, "2017-04-20", "2017-04-30");
        t.true(response.success);
    }
});

test("Get from /accounts/{id}/balance returns success for each result account", async (t) => {
    const resp: TrueLayer.IResponse<TrueLayer.IAccount> = await clientData.getAccounts(access_token);
    const accounts: [TrueLayer.IAccount] = resp.results as [TrueLayer.IAccount];
    const assertions: number = accounts.length;
    t.plan(assertions);

    for (const account of accounts) {
        const response: TrueLayer.IResponse<TrueLayer.IBalance> = await clientData.getBalance(access_token, account.account_id);
        t.true(response.success);
    }
});
