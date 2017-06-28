import { Constants } from "../../src/v1/Constants";
import { DataAPIClient } from "../../src/v1/DataAPIClient";
import { Fixtures } from "./fixtures";
import * as request from "request-promise";
import * as sinon from "sinon";
import { test } from "ava";

// Instantiate to access fixtures
const fixtures = new Fixtures();

// Instantiate to access fixtures
const data = new DataAPIClient();

// isTokenExpired tests
test("isTokenExpired returns true on expired token", async (t) => {
    t.plan(1);
    const expired = DataAPIClient.isTokenExpired(fixtures.accessToken);
    t.true(expired);
});

if (process.env.access_token) {
    // Get access token from environment variable
    const access_token: string = process.env.access_token;
    test("isTokenExpired return false on fresh token", async (t) => {
        t.plan(1);
        const expired = DataAPIClient.isTokenExpired(access_token);
        t.false(expired, "You need to provide a working access token that hasn't gone beyond its one hour expiration");
    });
}

// Create sinon instance
const mock = sinon.sandbox.create();

test.afterEach((t) => {
    mock.restore();
});

test("buildRequestOptions() - returns well formed request options - required params", async (t) => {
    t.plan(1);
    const actual = await DataAPIClient.buildRequestOptions(fixtures.accessToken, `${Constants.API_URL}/data/v1/info`);
    const expected = fixtures.requestOptions;
    t.deepEqual(actual, expected, "Incorrect response object.");
});

test("buildRequestOptions() - returns well formed request options - all params", async (t) => {
    const qs = {
        from: "2017-04-20",
        to: "2017-04-30"
    };
    t.plan(1);
    const actual = await DataAPIClient.buildRequestOptions(fixtures.accessToken, `${Constants.API_URL}/data/v1/info`, qs);
    const expected = fixtures.requestOptionsQs;
    t.deepEqual(actual, expected, "Incorrect response object.");
});

test("stubbed request body for /Me endpoint is correctly parsed", async (t) => {
    const expected = fixtures.meResponse;
    mock.stub(request, "get").returns(JSON.stringify(expected));
    const actual = await DataAPIClient.getMe(fixtures.accessToken);
    t.plan(1);
    return t.deepEqual(actual, expected);
});

test.serial("stubbed request body for /Info endpoint is correctly parsed", async (t) => {
    const expected = fixtures.infoResponse;
    mock.stub(request, "get").returns(JSON.stringify(expected));
    const actual = await DataAPIClient.getInfo(fixtures.accessToken);
    t.plan(1);
    return t.deepEqual(actual, expected);
});

test.serial("stubbed request body for /Accounts endpoint is correctly parsed", async (t) => {
    const expected = fixtures.accountsResponse;
    mock.stub(request, "get").returns(JSON.stringify(expected));
    const actual = await DataAPIClient.getAccounts(fixtures.accessToken);
    t.plan(1);
    return t.deepEqual(actual, expected);
});

test.serial("stubbed request body for /Accounts/{id} endpoint.deepEqual correctly parsed", async (t) => {
    const expected = fixtures.accountsResponse;
    mock.stub(request, "get").returns(JSON.stringify(expected));
    const actual = await DataAPIClient.getAccount(fixtures.accessToken, "test_account_id");
    t.plan(1);
    return t.deepEqual(actual, expected);
});

test.serial("stubbed request body for /Balance endpoint is correctly parsed", async (t) => {
    const expected = fixtures.balanceResponse;
    mock.stub(request, "get").returns(JSON.stringify(expected));
    const actual = await DataAPIClient.getBalance(fixtures.accessToken, "test_account_id");
    t.plan(1);
    return t.deepEqual(actual, expected);
});

test.serial("stubbed request body for /Transactions endpoint is correctly parsed", async (t) => {
    const expected = fixtures.transactionsResponse;
    mock.stub(request, "get").returns(JSON.stringify(expected));
    const actual = await DataAPIClient.getTransactions(fixtures.accessToken, "test_account_id", "2017-04-20", "2017-04-30");
    t.plan(1);
    return t.deepEqual(actual, expected);
});
