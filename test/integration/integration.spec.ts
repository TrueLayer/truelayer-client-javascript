import { test } from "ava";
import * as TrueLayer from "./../../index";
import * as moment from "moment";

if (process.env.access_token) {
    // Get access token from environment variable
    const access_token: string = process.env.access_token;

    // Setup the client with dummy options
    const client = new TrueLayer.V1.Client({
        client_id: "INVALID",
        client_secret: "INVALID"
    });

    test.serial("Get /me returns success", async (t) => {
        t.plan(1);
        const response = await client.data.getMe(access_token);
        t.true(response.success);
    });

    test.serial("Get /me returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(client.data.getMe("invalid_token"));
        t.is(error.message, "{\"name\":\"internal_server_error\",\"message\":\"unknown error\"}");
    });

    test.serial("Get /info returns success", async (t) => {
        t.plan(1);
        const response = await client.data.getInfo(access_token);
        t.true(response.success);
    });

    test.serial("Get /info returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(client.data.getInfo("invalid_token"));
        t.is(error.message, "{\"name\":\"unauthorized\",\"message\":\"Unauthorized\"}");
    });

    test.serial("Get /accounts returns success", async (t) => {
        t.plan(1);
        const response = await client.data.getAccounts(access_token);
        t.true(response.success);
    });

    test.serial("Get /accounts returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(client.data.getAccounts("invalid_token"));
        t.is(error.message, "{\"name\":\"unauthorized\",\"message\":\"Unauthorized\"}");
    });

    test.serial("Get /account returns success for each result account", async (t) => {
        const resp = await client.data.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);

        for (const account of accounts) {
            const response = await client.data.getAccount(access_token, account.account_id);
            t.true(response.success);
        }
    });

    test.serial("Get /account returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(client.data.getAccount("invalid_token", "account"));
        t.is(error.message, "{\"name\":\"unauthorized\",\"message\":\"Unauthorized\"}");
    });

    test.serial("Get /account returns error - invalid account", async (t) => {
        t.plan(2);
        const error = await t.throws(client.data.getAccount(access_token, "invalid_account"));
        t.is(error.message, "{\"name\":\"account_not_found\",\"message\":\"account not found\"}");
    });

    test.serial("Get /accounts/{id}/transactions returns success for each account", async (t) => {
        const resp = await client.data.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);
        const from: string = moment().subtract(1, "month").format("YYYY-MM-DD");
        const to: string = moment().format("YYYY-MM-DD");
        for (const account of accounts) {
            const response = await client.data.getTransactions(access_token, account.account_id, from, to);
            t.true(response.success);
        }
    });

    test.serial("Get /accounts/{id}/transactions returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(client.data.getTransactions("invalid_token", "invalid_account", "2017-05-05", "2017-05-07"));
        t.is(error.message, "{\"name\":\"unauthorized\",\"message\":\"Unauthorized\"}");
    });

    test.serial("Get /accounts/{id}/transactions returns error - invalid account", async (t) => {
        t.plan(2);
        const error = await t.throws(client.data.getTransactions(access_token, "invalid_account", "2017-05-05", "2017-05-07"));
        t.is(error.message, "{\"name\":\"internal_server_error\",\"message\":\"unknown error\"}");
    });

    test.serial("Get /accounts/{id}/balance returns success for each account", async (t) => {
        const resp = await client.data.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);

        for (const account of accounts) {
            const response = await client.data.getBalance(access_token, account.account_id);
            t.true(response.success);
        }
    });

    test.serial("Get /accounts/{id}/balance returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(client.data.getBalance("invalid_token", "invalid_account"));
        t.is(error.message, "{\"name\":\"unauthorized\",\"message\":\"Unauthorized\"}");
    });

    test.serial("Get /accounts/{id}/balance returns error - invalid account", async (t) => {
        t.plan(2);
        const error = await t.throws(client.data.getBalance(access_token, "invalid_account"));
        t.is(error.message, "{\"name\":\"internal_server_error\",\"message\":\"unknown error\"}");
    });

} else {
    // tslint:disable-next-line:no-console
    console.log("No 'access_token' environment variable set. Skipping integration tests...\n");
}
