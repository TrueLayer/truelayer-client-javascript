import { test } from "ava";
import * as TrueLayer from "./../../index";
import * as moment from "moment";
import { DataAPIClient } from "../../src/v1/DataAPIClient";

if (process.env.access_token) {
    // Get access token from environment variable
    const access_token: string = process.env.access_token;

    test.serial("Get /me returns success", async (t) => {
        t.plan(1);
        const response = await DataAPIClient.getMe(access_token);
        t.true(response.success);
    });

    test.serial("Get /me returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(DataAPIClient.getMe("invalid_token"));
        t.is(error.message, JSON.stringify({ name: "internal_server_error", message: "unknown error" }));
    });

    test.serial("Get /info returns success", async (t) => {
        t.plan(1);
        const response = await DataAPIClient.getInfo(access_token);
        t.true(response.success);
    });

    // TODO: fix tests for the new Error structure
    test.serial("Get /info returns error - invalid token", async (t) => {
        t.plan(3);
        const error = await t.throws(DataAPIClient.getInfo("invalid_token"));
        t.is(error.code, "unauthorized");
        t.is(error.message, "Unauthorized");
    });

    test.serial("Get /accounts returns success", async (t) => {
        t.plan(1);
        const response = await DataAPIClient.getAccounts(access_token);
        t.true(response.success);
    });

    test.serial("Get /accounts returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(DataAPIClient.getAccounts("invalid_token"));
        t.is(error.message, "{\"name\":\"unauthorized\",\"message\":\"Unauthorized\"}");
    });

    test.serial("Get /account returns success for each result account", async (t) => {
        const resp = await DataAPIClient.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);

        for (const account of accounts) {
            const response = await DataAPIClient.getAccount(access_token, account.account_id);
            t.true(response.success);
        }
    });

    test.serial("Get /account returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(DataAPIClient.getAccount("invalid_token", "account"));
        t.is(error.message, "{\"name\":\"unauthorized\",\"message\":\"Unauthorized\"}");
    });

    test.serial("Get /account returns error - invalid account", async (t) => {
        t.plan(2);
        const error = await t.throws(DataAPIClient.getAccount(access_token, "invalid_account"));
        t.is(error.message, "{\"name\":\"account_not_found\",\"message\":\"account not found\"}");
    });

    test.serial("Get /accounts/{id}/transactions returns success for each account", async (t) => {
        const resp = await DataAPIClient.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);
        const from: string = moment().subtract(1, "month").format("YYYY-MM-DD");
        const to: string = moment().format("YYYY-MM-DD");
        for (const account of accounts) {
            const response = await DataAPIClient.getTransactions(access_token, account.account_id, from, to);
            t.true(response.success);
        }
    });

    test.serial("Get /accounts/{id}/transactions returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(DataAPIClient.getTransactions("invalid_token", "invalid_account", "2017-05-05", "2017-05-07"));
        t.is(error.message, "{\"name\":\"unauthorized\",\"message\":\"Unauthorized\"}");
    });

    test.serial("Get /accounts/{id}/transactions returns error - invalid account", async (t) => {
        t.plan(2);
        const error = await t.throws(DataAPIClient.getTransactions(access_token, "invalid_account", "2017-05-05", "2017-05-07"));
        t.is(error.message, "{\"name\":\"internal_server_error\",\"message\":\"unknown error\"}");
    });

    test.serial("Get /accounts/{id}/balance returns success for each account", async (t) => {
        const resp = await DataAPIClient.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);

        for (const account of accounts) {
            const response = await DataAPIClient.getBalance(access_token, account.account_id);
            t.true(response.success);
        }
    });

    test.serial("Get /accounts/{id}/balance returns error - invalid token", async (t) => {
        t.plan(2);
        const error = await t.throws(DataAPIClient.getBalance("invalid_token", "invalid_account"));
        t.is(error.message, "{\"name\":\"unauthorized\",\"message\":\"Unauthorized\"}");
    });

    test.serial("Get /accounts/{id}/balance returns error - invalid account", async (t) => {
        t.plan(2);
        const error = await t.throws(DataAPIClient.getBalance(access_token, "invalid_account"));
        t.is(error.message, "{\"name\":\"internal_server_error\",\"message\":\"unknown error\"}");
    });

} else {
    test("No 'access_token' environment variable set. Integration test disabled.", (t) => t.pass());
}
