import { ApiError } from "../../src/v1/APIError";
import { DataAPIClient } from "../../src/v1/DataAPIClient";
import { test } from "ava";
import * as moment from "moment";
import * as TrueLayer from "./../../index";

if (process.env.access_token) {
    // Get access token from environment variable
    const access_token: string = process.env.access_token;

    test.serial("Get /me returns success", async (t) => {
        t.plan(1);
        const response = await t.notThrows(DataAPIClient.getMe(access_token));
    });

    test.serial("Get /me returns error - invalid token", async (t) => {
        t.plan(3);
        const error = await t.throws(DataAPIClient.getMe("invalid_token"));
        t.is(error.code, "invalid_access_token");
        t.is(error.message, "Invalid access token");
    });

    test.serial("Get /info returns success", async (t) => {
        t.plan(1);
        const response = await t.notThrows(DataAPIClient.getInfo(access_token));
    });

    test.serial("Get /info returns error - invalid token", async (t) => {
        t.plan(3);
        const error = await t.throws(DataAPIClient.getInfo("invalid_token"));
        t.is(error.code, "invalid_access_token");
        t.is(error.message, "Invalid access token");
    });

    test.serial("Get /accounts returns success", async (t) => {
        t.plan(1);
        const response = await t.notThrows(DataAPIClient.getAccounts(access_token));
    });

    test.serial("Get /accounts returns error - invalid token", async (t) => {
        t.plan(3);
        const error = await t.throws(DataAPIClient.getAccounts("invalid_token"));
        t.is(error.code, "invalid_access_token");
        t.is(error.message, "Invalid access token");
    });

    test.serial("Get /account returns success for each result account", async (t) => {
        const resp = await DataAPIClient.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);
        for (const account of accounts) {
            const response = await t.notThrows(DataAPIClient.getAccount(access_token, account.account_id));
        }
    });

    test.serial("Get /account returns error - invalid token", async (t) => {
        t.plan(3);
        const error = await t.throws(DataAPIClient.getAccount("invalid_token", "account"));
        t.is(error.code, "invalid_access_token");
        t.is(error.message, "Invalid access token");
    });

    test.serial("Get /account returns error - invalid account", async (t) => {
        t.plan(3);
        const error = await t.throws(DataAPIClient.getAccount(access_token, "invalid_account"));
        t.is(error.code, "account_not_found");
        t.is(error.message, "account_not_found");
    });

    test.serial("Get /accounts/{id}/transactions returns success for each account", async (t) => {
        const resp = await DataAPIClient.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);
        const from: string = moment().subtract(1, "month").format("YYYY-MM-DD");
        const to: string = moment().format("YYYY-MM-DD");
        for (const account of accounts) {
            const response = await t.notThrows(DataAPIClient.getTransactions(access_token, account.account_id, from, to));
        }
    });

    test.serial("Get /accounts/{id}/transactions returns error - invalid token", async (t) => {
        t.plan(3);
        const error = await t.throws(DataAPIClient.getTransactions("invalid_token", "invalid_account", "2017-05-05", "2017-05-07"));
        t.is(error.code, "invalid_access_token");
        t.is(error.message, "Invalid access token");
    });

    test.serial("Get /accounts/{id}/transactions returns error - invalid account", async (t) => {
        t.plan(3);
        const error = await t.throws(DataAPIClient.getTransactions(access_token, "invalid_account", "2017-05-05", "2017-05-07"));
        t.is(error.code, "account_not_found");
        t.is(error.message, "account_not_found");
    });

    test.serial("Get /accounts/{id}/balance returns success for each account", async (t) => {
        const resp = await DataAPIClient.getAccounts(access_token);
        const accounts: TrueLayer.IAccount[] = resp.results;
        const assertions: number = accounts.length;
        t.plan(assertions);
        for (const account of accounts) {
            const response = await t.notThrows(DataAPIClient.getBalance(access_token, account.account_id));
        }
    });

    test.serial("Get /accounts/{id}/balance returns error - invalid token", async (t) => {
        t.plan(3);
        const error = await t.throws(DataAPIClient.getBalance("invalid_token", "invalid_account"));
        t.is(error.code, "invalid_access_token");
        t.is(error.message, "Invalid access token");
    });

    test.serial("Get /accounts/{id}/balance returns error - invalid account", async (t) => {
        t.plan(3);
        const error = await t.throws(DataAPIClient.getBalance(access_token, "invalid_account"));
        t.is(error.code, "account_not_found");
        t.is(error.message, "account_not_found");
    });

} else {
    test("No 'access_token' environment variable set. Integration test disabled.", (t) => t.pass());
}
