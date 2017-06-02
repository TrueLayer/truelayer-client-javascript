import Constants from "./../../src/v1/constants";
import Data from "./../../src/v1/data";
import Fixtures from "./fixtures";
import IResponse from "./../../src/v1/interfaces/data/IResponse";
import ITransaction from "./../../src/v1/interfaces/data/ITransaction";
import IAccount from "./../../src/v1/interfaces/data/IAccount";
import IBalance from "./../../src/v1/interfaces/data/IBalance";
import IInfo from "./../../src/v1/interfaces/data/IInfo";
import IMe from "./../../src/v1/interfaces/data/IMe";
import * as request from "request-promise";
import * as sinon from "sinon";
import test from "ava";

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
    t.deepEqual(actual.results[0].client_id, expected.results[0].client_id, "Incorrect results.cliend_id value");
    t.deepEqual(actual.results[0].credentials_id, expected.results[0].credentials_id, "Incorrect results.credentials_id value");
    t.deepEqual(actual.results[0].provider_id, expected.results[0].provider_id, "Incorrect results.provider_id value");
});

test.serial("stubbed request body for /Info endpoint is correctly parsed", async (t) => {
    t.plan(7);
    mock.stub(request, "get").returns(JSON.parse(fixtures.infoResponse));
    const actual = await data.getInfo(fixtures.accessToken);
    const expected: IResponse<IInfo> = JSON.parse(fixtures.infoResponse);
    t.is(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual.results[0].addresses, expected.results[0].addresses, "Incorrect results.addresses value");
    t.deepEqual(actual.results[0].date_of_birth, expected.results[0].date_of_birth, "Incorrect results.date_of_birth value");
    t.deepEqual(actual.results[0].emails, expected.results[0].emails, "Incorrect results.emails value");
    t.deepEqual(actual.results[0].full_name, expected.results[0].full_name, "Incorrect results.full_name value");
    t.deepEqual(actual.results[0].phones, expected.results[0].phones, "Incorrect results.phones value");
    t.deepEqual(actual.results[0].update_timestamp, expected.results[0].update_timestamp, "Incorrect results.update_timestamp value");
});

test.serial("stubbed request body for /Accounts endpoint is correctly parsed", async (t) => {
    t.plan(8);
    mock.stub(request, "get").returns(JSON.parse(fixtures.accountsResponse));
    const actual = await data.getAccounts(fixtures.accessToken);
    const expected: IResponse<IAccount> = JSON.parse(fixtures.accountsResponse);
    t.is(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual.results[0].account_id, expected.results[0].account_id, "Incorrect results.account_id value");
    t.deepEqual(actual.results[0].account_number, expected.results[0].account_number, "Incorrect results.account_number value");
    t.deepEqual(actual.results[0].account_type, expected.results[0].account_type, "Incorrect results.account_types value");
    t.deepEqual(actual.results[0].currency, expected.results[0].currency, "Incorrect results.currency value");
    t.deepEqual(actual.results[0].display_name, expected.results[0].display_name, "Incorrect results.display_name value");
    t.deepEqual(actual.results[0].update_timestamp, expected.results[0].update_timestamp, "Incorrect results.update_timestamp value");
    t.deepEqual(actual.results[1], expected.results[1], "Incorrect results object");
});

test.serial("stubbed request body for /Accounts/{id} endpoint.deepEqual correctly parsed", async (t) => {
    t.plan(8);
    mock.stub(request, "get").returns(JSON.parse(fixtures.accountResponse));
    const actual = await data.getAccountInfo(fixtures.accessToken, "test_account_id");
    const expected: IResponse<IAccount> = JSON.parse(fixtures.accountResponse);
    t.is(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual.results[0].account_id, expected.results[0].account_id, "Incorrect results.account_id value");
    t.deepEqual(actual.results[0].account_number, expected.results[0].account_number, "Incorrect results.account_number value");
    t.deepEqual(actual.results[0].account_type, expected.results[0].account_type, "Incorrect results.account_types value");
    t.deepEqual(actual.results[0].currency, expected.results[0].currency, "Incorrect results.currency value");
    t.deepEqual(actual.results[0].display_name, expected.results[0].display_name, "Incorrect results.display_name value");
    t.deepEqual(actual.results[0].update_timestamp, expected.results[0].update_timestamp, "Incorrect results.update_timestamp value");
    t.deepEqual(actual.results[1], expected.results[1], "Incorrect results object");
});

test.serial("stubbed request body for /Balance endpoint is correctly parsed", async (t) => {
    t.plan(5);
    mock.stub(request, "get").returns(JSON.parse(fixtures.balanceResponse));
    const actual = await data.getBalance(fixtures.accessToken, "test_account_id");
    const expected: IResponse<IBalance> = JSON.parse(fixtures.balanceResponse);
    t.deepEqual(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual.results[0].available, expected.results[0].available, "Incorrect results.available value");
    t.deepEqual(actual.results[0].currency, expected.results[0].currency, "Incorrect results.currency value");
    t.deepEqual(actual.results[0].current, expected.results[0].current, "Incorrect results.current value");
    t.deepEqual(actual.results[0].update_timestamp, expected.results[0].update_timestamp, "Incorrect results.update_timestamp value");
});

test.serial("stubbed request body for /Transactions endpoint is correctly parsed", async (t) => {
    t.plan(15);
    mock.stub(request, "get").returns(JSON.parse(fixtures.transactionsResponse));
    const actual = await data.getTransactions(fixtures.accessToken, "test_account_id", "2017-04-20", "2017-04-30");
    const expected: IResponse<ITransaction> = JSON.parse(fixtures.transactionsResponse);
    t.deepEqual(actual.success, expected.success, "Incorrect success value");
    t.deepEqual(actual.results[0].amount, expected.results[0].amount, "Incorrect results.amount value");
    t.deepEqual(actual.results[0].balance, expected.results[0].balance, "Incorrect results.balance value");
    t.deepEqual(actual.results[0].currency, expected.results[0].currency, "Incorrect results.currency value");
    t.deepEqual(actual.results[0].description, expected.results[0].description, "Incorrect results.description value");
    t.deepEqual(actual.results[0].meta, expected.results[0].meta, "Incorrect results.meta value");
    t.deepEqual(actual.results[0].timestamp, expected.results[0].timestamp, "Incorrect results.timestamp value");
    t.deepEqual(actual.results[0].transaction_type, expected.results[0].transaction_type, "Incorrect results.transaction_type value");
    t.deepEqual(actual.results[1], expected.results[1], "Incorrect transaction object @ index 1");
    t.deepEqual(actual.results[2], expected.results[2], "Incorrect transaction object @ index 2");
    t.deepEqual(actual.results[3], expected.results[3], "Incorrect transaction object @ index 3");
    t.deepEqual(actual.results[4], expected.results[4], "Incorrect transaction object @ index 4");
    t.deepEqual(actual.results[5], expected.results[5], "Incorrect transaction object @ index 5");
    t.deepEqual(actual.results[6], expected.results[6], "Incorrect transaction object @ index 6");
    t.deepEqual(actual.results[7], expected.results[7], "Incorrect transaction object @ index 7");
});
