import { Constants } from "../../src/v1/Constants";
import { DataAPIClient } from "../../src/v1/DataAPIClient";
import { Fixtures } from "./fixtures";
import { test } from "ava";
import * as request from "request-promise";
import * as sinon from "sinon";

// Instantiate to access fixtures
const fixtures = new Fixtures();

// validateToken() tests
test("validateToken returns false on expired token", async (t) => {
    t.plan(1);
    const expired = DataAPIClient.validateToken(fixtures.accessToken);
    t.false(expired);
});

// Create sinon instance
const mock = sinon.sandbox.create();

test.afterEach((t) => {
    // After each test restore stubbed methods
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

// Get access token from environment variable
const access_token: string = (process.env.access_token as string);

// Only run the below stubbed tests with a valid access token
if (DataAPIClient.validateToken(access_token)) {

    test("validateToken returns false on fresh token", async (t) => {
        t.plan(1);
        const expired = DataAPIClient.validateToken(access_token);
        t.true(expired, "You need to provide a working access token that hasn't gone beyond its one hour expiration");
    });

    test("stubbed request body for /Me endpoint is correctly parsed", async (t) => {
        const expected = fixtures.meResponse;
        mock.stub(request, "get").returns(JSON.stringify(expected));
        const actual = await DataAPIClient.getMe(access_token);
        t.plan(1);
        t.deepEqual(actual, expected);
    });

    test.serial("stubbed request body for /Info endpoint is correctly parsed", async (t) => {
        const expected = fixtures.infoResponse;
        mock.stub(request, "get").returns(JSON.stringify(expected));
        const actual = await DataAPIClient.getInfo(access_token);
        t.plan(1);
        t.deepEqual(actual, expected);
    });

    test.serial("stubbed request body for /Accounts endpoint is correctly parsed", async (t) => {
        const expected = fixtures.accountsResponse;
        mock.stub(request, "get").returns(JSON.stringify(expected));
        const actual = await DataAPIClient.getAccounts(access_token);
        t.plan(1);
        t.deepEqual(actual, expected);
    });

    test.serial("stubbed request body for /Accounts/{id} endpoint.deepEqual correctly parsed", async (t) => {
        const expected = fixtures.accountsResponse;
        mock.stub(request, "get").returns(JSON.stringify(expected));
        const actual = await DataAPIClient.getAccount(access_token, "test_account_id");
        t.plan(1);
        t.deepEqual(actual, expected);
    });

    test.serial("stubbed request body for /Accounts/{id}/Balance endpoint is correctly parsed", async (t) => {
        const expected = fixtures.accountBalanceResponse;
        mock.stub(request, "get").returns(JSON.stringify(expected));
        const actual = await DataAPIClient.getBalance(access_token, "test_account_id");
        t.plan(1);
        t.deepEqual(actual, expected);
    });

    test.serial("stubbed request body for /Accounts/{id}/Transactions endpoint is correctly parsed", async (t) => {
        const expected = fixtures.accountTransactionsResponse;
        mock.stub(request, "get").returns(JSON.stringify(expected));
        const actual = await DataAPIClient.getTransactions(access_token, "test_account_id", "2017-04-20", "2017-04-30");
        t.plan(1);
        t.deepEqual(actual, expected);
    });

    test.serial("stubbed request body for /Cards endpoint is correctly parsed", async (t) => {
        const expected = fixtures.cardsResponse;
        mock.stub(request, "get").returns(JSON.stringify(expected));
        const actual = await DataAPIClient.getCards(access_token);
        t.plan(1);
        t.deepEqual(actual, expected);
    });

    test.serial("stubbed request body for /Cards/{id} endpoint.deepEqual correctly parsed", async (t) => {
        const expected = fixtures.cardResponse;
        mock.stub(request, "get").returns(JSON.stringify(expected));
        const actual = await DataAPIClient.getCard(access_token, "test_account_id");
        t.plan(1);
        t.deepEqual(actual, expected);
    });

    test.serial("stubbed request body for /Cards/{id}/Balance endpoint is correctly parsed", async (t) => {
        const expected = fixtures.cardBalanceResponse;
        mock.stub(request, "get").returns(JSON.stringify(expected));
        const actual = await DataAPIClient.getCardBalance(access_token, "test_account_id");
        t.plan(1);
        t.deepEqual(actual, expected);
    });

    test.serial("stubbed request body for /Cards/{id}/Transactions endpoint is correctly parsed", async (t) => {
        const expected = fixtures.cardTransactionsResponse;
        mock.stub(request, "get").returns(JSON.stringify(expected));
        const actual = await DataAPIClient.getCardTransactions(access_token, "test_account_id", "2017-04-20", "2017-04-30");
        t.plan(1);
        t.deepEqual(actual, expected);
    })
}
