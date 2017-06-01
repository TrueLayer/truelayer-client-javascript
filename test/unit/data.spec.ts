// Internal imports
import Data from "./../../src/v1/data";
import C from "./../../src/v1/constants";
import Fixtures from "./fixtures";

// External imports
import * as request from "request-promise";
import * as sinon from "sinon";
import test from "ava";

// Instantiate to access fixtures
const fixtures = new Fixtures();

// Instantiate to access fixtures
const data = new Data();

test("buildRequestOptions() - returns well formed request options - required params", async (t) => {
    t.plan(1);
    const actual = await data.buildRequestOptions(fixtures.accessToken, `${C.API_HOST}/data/v1/info`);
    const expected = fixtures.requestOptions;
    t.deepEqual(actual, expected, "Incorrect response object.");
});

test("buildRequestOptions() - returns well formed request options - all params", async (t) => {
    const qs = {
        from: "2017-04-20",
        to: "2017-04-30"
    };
    t.plan(1);
    const actual = await data.buildRequestOptions(fixtures.accessToken, `${C.API_HOST}/data/v1/info`, qs);
    const expected = fixtures.requestOptionsQs;
    t.deepEqual(actual, expected, "Incorrect response object.");
});

test.before((t) => {
    sinon.stub(request, "get").returns(fixtures.meResponse);
});

test("stubbed request response body for /Me endpoint is correctly parsed", async (t) => {
    t.plan(1);
    const actual = await data.getMe(fixtures.accessToken);
    const expected: any = fixtures.meResponse;
    t.is(actual.success, expected.success, "Incorrect success value");
    // t.is(actual.results[0].client_id, expected.results[0].client_id, "Incorrect results.cliend_id value");
});
