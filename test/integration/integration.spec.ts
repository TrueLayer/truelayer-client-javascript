import * as TrueLayer from "./../../index";
import test from "ava";

if (process.env.access_token) {
    // Get access token from environment variable
    const access_token: string = process.env.access_token;

    // Dummy values
    const clientId: string = "test";
    const clientSecret: string = "secret";
    const redirectUri: string = "http://localhost:5000/truelayer-redirect";

    // Build 'options' to pass to APIClient
    const options: TrueLayer.IOptions = {
        client_id: clientId,
        client_secret: clientSecret
    };

    // Setup the client with dummy options
    const client = new TrueLayer.V1.ApiClient(options);

    test("Get from /me returns success", async (t) => {
        t.plan(1);
        const response = await client.data.getMe(access_token);
        t.true(response.success);
    });

    test("Get from /info returns success", async (t) => {
        t.plan(1);
        const response = await client.data.getInfo(access_token);
        t.true(response.success);
    });

    test("Get from /accounts returns success", async (t) => {
        t.plan(1);
        const response = await client.data.getAccounts(access_token);
        t.true(response.success);
    });

    test("Get from /acccounts returns success for each result account", async (t) => {
        const resp = await client.data.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);

        for (const account of accounts) {
            const response = await client.data.getAccountInfo(access_token, account.account_id);
            t.true(response.success);
        }
    });

    test("Get from /accounts/{id}/transactions returns success for each result account", async (t) => {
        const resp = await client.data.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);

        for (const account of accounts) {
            const response = await client.data.getTransactions(access_token, account.account_id, "2017-04-20", "2017-04-30");
            t.true(response.success);
        }
    });

    test("Get from /accounts/{id}/balance returns success for each result account", async (t) => {
        const resp = await client.data.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);

        for (const account of accounts) {
            const response = await client.data.getBalance(access_token, account.account_id);
            t.true(response.success);
        }
    });

} else {
    // tslint:disable-next-line:no-console
    console.log("No 'access_token' environment varialbe set. Skipping integration tests...\n");
}
