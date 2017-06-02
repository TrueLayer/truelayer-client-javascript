import { Constants } from "./../../src/v1/constants";
import { Data } from "./../../src/v1/data";
import { Fixtures } from "./fixtures";
import { IResponse } from "./../../src/v1/interfaces/data/IResponse";
import { ITransaction } from "./../../src/v1/interfaces/data/ITransaction";
import { IAccount } from "./../../src/v1/interfaces/data/IAccount";
import { IBalance } from "./../../src/v1/interfaces/data/IBalance";
import { IInfo } from "./../../src/v1/interfaces/data/IInfo";
import { IMe } from "./../../src/v1/interfaces/data/IMe";
import * as request from "request-promise";
import * as sinon from "sinon";
import { test } from "ava";

// Instantiate to access fixtures
const fixtures = new Fixtures();

// Instantiate to access fixtures
const data = new Data();

// Create sinon instance
const mock = sinon.sandbox.create();

test("buildRequestOptions() - returns well formed request options - required params", async (t) => {
    t.plan(1);
    const actual = await data.buildRequestOptions(fixtures.accessToken, `${Constants.API_HOST}/data/v1/info`);
    const expected = fixtures.requestOptions;
    t.deepEqual(actual, expected, "Incorrect response object.");
});

test("buildRequestOptions() - returns well formed request options - all params", async (t) => {
    const qs = {
        from: "2017-04-20",
        to: "2017-04-30"
    };
    t.plan(1);
    const actual = await data.buildRequestOptions(fixtures.accessToken, `${Constants.API_HOST}/data/v1/info`, qs);
    const expected = fixtures.requestOptionsQs;
    t.deepEqual(actual, expected, "Incorrect response object.");
});

test.afterEach((t) => {
    mock.restore();
});

test.serial("stubbed request body for /Me endpoint is correctly parsed", async (t) => {
    t.plan(4);
    mock.stub(request, "get").returns(JSON.parse(fixtures.meResponse));
    const actual = await data.getMe(fixtures.accessToken);
    const expected: IResponse<IMe> = JSON.parse(fixtures.meResponse);
    t.is(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual, expected, "Incorrect results.cliend_id value");
});

test.serial("stubbed request body for /Info endpoint is correctly parsed", async (t) => {
    t.plan(7);
    mock.stub(request, "get").returns(JSON.parse(fixtures.infoResponse));
    const actual = await data.getInfo(fixtures.accessToken);
    const expected: IResponse<IInfo> = JSON.parse(fixtures.infoResponse);
    t.is(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual, expected, "Incorrect results.addresses value");
});

test.serial("stubbed request body for /Accounts endpoint is correctly parsed", async (t) => {
    t.plan(8);
    mock.stub(request, "get").returns(JSON.parse(fixtures.accountsResponse));
    const actual = await data.getAccounts(fixtures.accessToken);
    const expected: IResponse<IAccount> = JSON.parse(fixtures.accountsResponse);
    t.is(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual, expected, "Incorrect results.account_id value");
});

test.serial("stubbed request body for /Accounts/{id} endpoint.deepEqual correctly parsed", async (t) => {
    t.plan(8);
    mock.stub(request, "get").returns(JSON.parse(fixtures.accountResponse));
    const actual = await data.getAccountInfo(fixtures.accessToken, "test_account_id");
    const expected: IResponse<IAccount> = JSON.parse(fixtures.accountResponse);
    t.is(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual, expected, "Incorrect results.account_id value");
});

test.serial("stubbed request body for /Balance endpoint is correctly parsed", async (t) => {
    t.plan(5);
    mock.stub(request, "get").returns(JSON.parse(fixtures.balanceResponse));
    const actual = await data.getBalance(fixtures.accessToken, "test_account_id");
    const expected: IResponse<IBalance> = JSON.parse(fixtures.balanceResponse);
    t.is(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual, expected, "Incorrect results.available value");
});

test.serial("stubbed request body for /Transactions endpoint is correctly parsed", async (t) => {
    t.plan(15);
    mock.stub(request, "get").returns(JSON.parse(fixtures.transactionsResponse));
    const actual = await data.getTransactions(fixtures.accessToken, "test_account_id", "2017-04-20", "2017-04-30");
    const expected: IResponse<ITransaction> = JSON.parse(fixtures.transactionsResponse);
    t.is(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual, expected, "Incorrect results.amount value");
});
