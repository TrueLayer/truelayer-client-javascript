import { test } from "ava";
import * as TrueLayer from "../../index";
import { IToken } from "../../src/v1/interfaces/auth/IToken";
import { Fixtures } from "./fixtures";
import * as request from "request-promise";
import * as sinon from "sinon";
import { IOptions } from "../../src/v1/interfaces/auth/IOptions";
import { AuthAPIClient } from "../../src/v1/AuthAPIClient";

// Build 'options' to pass to Client
const options: IOptions = {
    client_id: "client_id",
    client_secret: "client_secret"
};

// Create an array of scopes
const scope: string[] = [
    "offline_access",
    "info",
    "accounts",
    "transactions",
    "balance"
];

const client = new TrueLayer.V1.Client(options);

let fixtures: Fixtures;

test.before((t) => {
    fixtures = new Fixtures();
});

test("Get authentication URL - without mock enabled", (t) => {
    t.plan(1);
    const actual = client.auth.getAuthUrl("http://url", scope, "nonce", "state", false);
    const expected: string = "https://auth.truelayer.com/?response_type=code&response_mode=form_post&client_id=client_id&redirect_uri=http://url&scope=offline_access info accounts transactions balance&nonce=nonce&state=state";
    t.is(actual, expected, "Authentication url does not have the expected value");
});

test("Get authentication URL - with mock enabled", (t) => {
    t.plan(1);
    const actual = client.auth.getAuthUrl("http://url", scope, "nonce", "state", true);
    const expected: string = "https://auth.truelayer.com/?response_type=code&response_mode=form_post&client_id=client_id&redirect_uri=http://url&scope=offline_access info accounts transactions balance&nonce=nonce&state=state&enable_mock=true";
    t.is(actual, expected, "Authentication url does not have the expected value");
});

test("Get authentication URL - no optional params provided", (t) => {
    t.plan(1);
    const response = client.auth.getAuthUrl("http://url", scope, "nouce");
    const expectedUrl: string = "https://auth.truelayer.com/?response_type=code&response_mode=form_post&client_id=client_id&redirect_uri=http://url&scope=offline_access info accounts transactions balance&nonce=nouce";
    t.is(response, expectedUrl, "Authentication url does not have the expected value");
});

test("isTokenExpired returns true on expired token", async (t) => {
    t.plan(1);
    const expired = AuthAPIClient.isTokenExpired(fixtures.accessToken);
    t.true(expired);
});

if (process.env.access_token) {
    // Get access token from environment variable
    const access_token: string = process.env.access_token;
    test("isTokenExpired return false on fresh token", async (t) => {
        t.plan(1);
        const expired = AuthAPIClient.isTokenExpired(access_token);
        t.false(expired, "You need to provide a working access token that hasn't gone beyond its one hour expiration");
    });
}

test("Exchange code for token", async (t) => {
    t.plan(2);
    sinon.stub(request, "post").returns(fixtures.authResponse);
    const expected: IToken = {
        access_token: "test_access_token",
        refresh_token: "test_refresh_token"
    };
    const actual = await client.auth.exchangeCodeForToken("https://test.com", "dummy_code");
    t.deepEqual(actual.access_token, expected.access_token, "Access token not as expected");
    t.deepEqual(actual.refresh_token, expected.refresh_token, "Refresh token not as expected");
});
