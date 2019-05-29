import { Fixtures } from "./fixtures";
import { test } from "ava";
import * as request from "request-promise";
import * as sinon from "sinon";
import { StatusAPIClient } from "../../src/v1/StatusAPIClient";

// Instantiate to access fixtures
const fixtures = new Fixtures();

// Create sinon instance
const mock = sinon.sandbox.create();

test.afterEach((t) => {
    // After each test restore stubbed methods
    mock.restore();
});

test.serial("stubbed request body for /data/status endpoint is correctly parsed", async (t) => {
    const expected = fixtures.statusResponse;
    mock.stub(request, "get").returns(JSON.stringify(expected));
    const from = new Date("2019-01-07T10:00:00");
    const to = new Date("2019-01-08T13:00:00");
    const providers = ["hsbc", "oauth-monzo", "ob-barclays"];
    const endpoints = ["accounts", "info"];
    const actual = await StatusAPIClient.getStatus(from, to, providers, endpoints);
    t.plan(1);
    t.deepEqual(actual, expected);
});
