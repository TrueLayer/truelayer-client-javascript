import { AuthAPIClient } from "../../src/v1/AuthAPIClient";
import { Fixtures } from "./fixtures";
import { IOptions } from "../../src/v1/interfaces/auth/IOptions";
import { ITokenResponse } from "../../src/v1/interfaces/auth/ITokenResponse";
import { test } from "ava";
import * as request from "request-promise";
import * as sinon from "sinon";
import * as TrueLayer from "../../index";

// Build client options
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
    "balance",
    "cards"
];

// Create auth client instance
const client = new TrueLayer.AuthAPIClient(options);

// Instantiate to access fixtures
const fixtures = new Fixtures();

test("Get authentication URL - no mock or response mode", (t) => {
    t.plan(1);
    const actual = client.getAuthUrl({
        redirectURI: "http://url",
        scope,
        nonce: "nonce",
        state: "state",
        enableMock: false
    });
    const expected: string = "https://auth.truelayer.com/?response_type=code&client_id=client_id&redirect_uri=http://url&scope=offline_access%20info%20accounts%20transactions%20balance%20cards&nonce=nonce&state=state";
    t.is(actual, expected, "Authentication url does not have the expected value");
});

test("Get authentication URL - with explicit response mode and without mock enabled", (t) => {
    t.plan(1);
    const actual = client.getAuthUrl({
        redirectURI: "http://url",
        scope,
        nonce: "nonce",
        responseMode: "form_post",
        state: "state",
        enableMock: false
    });
    const expected: string = "https://auth.truelayer.com/?response_type=code&client_id=client_id&redirect_uri=http://url&scope=offline_access%20info%20accounts%20transactions%20balance%20cards&nonce=nonce&response_mode=form_post&state=state";
    t.is(actual, expected, "Authentication url does not have the expected value");
});

test("Get authentication URL - with mock and state", (t) => {
    t.plan(1);
    const actual = client.getAuthUrl({
        redirectURI: "http://url",
        scope,
        nonce: "nonce",
        state: "state",
        enableMock: true
    });
    const expected: string = "https://auth.truelayer.com/?response_type=code&client_id=client_id&redirect_uri=http://url&scope=offline_access%20info%20accounts%20transactions%20balance%20cards&nonce=nonce&state=state&enable_mock=true";
    t.is(actual, expected, "Authentication url does not have the expected value");
});

test("Get authentication URL - all optional params provided", (t) => {
    t.plan(1);
    const response = client.getAuthUrl({
        redirectURI: "http://url",
        scope,
        nonce: "nonce",
        responseMode: "form_post",
        state: "state",
        enableMock: true,
        enableCredentialsSharing: true,
        enableCredentialsSharingDe: true,
        enableOauth: true,
        enableOpenBanking: true,
        disableProviders: ["a", "b", "c"],
        providerId: "z"
    });
    const expected: string = "https://auth.truelayer.com/?response_type=code&client_id=client_id&redirect_uri=http://url&scope=offline_access%20info%20accounts%20transactions%20balance%20cards&nonce=nonce&response_mode=form_post&state=state&enable_mock=true&enable_credentials_sharing_providers=true&enable_credentials_sharing_providers_de=true&enable_oauth_providers=true&enable_open_banking_providers=true&disable_providers=a%20b%20c&provider_id=z";
    t.is(response, expected, "Authentication url does not have the expected value");
});

test("Get authentication URL - no optional params provided", (t) => {
    t.plan(1);
    const response = client.getAuthUrl({
        redirectURI: "http://url",
        scope,
        nonce: "nonce"
    });
    const expected: string = "https://auth.truelayer.com/?response_type=code&client_id=client_id&redirect_uri=http://url&scope=offline_access%20info%20accounts%20transactions%20balance%20cards&nonce=nonce";
    t.is(response, expected, "Authentication url does not have the expected value");
});

test("Exchange code for token", async (t) => {
    t.plan(2);
    sinon.stub(request, "post").returns(fixtures.authResponse);
    const expected: ITokenResponse = {
        access_token: "test_access_token",
        refresh_token: "test_refresh_token"
    };
    const actual = await client.exchangeCodeForToken("https://test.com", "dummy_code");
    t.deepEqual(actual.access_token, expected.access_token, "Access token not as expected");
    t.deepEqual(actual.refresh_token, expected.refresh_token, "Refresh token not as expected");
});

test("Get providers", async (t) => {
    t.plan(2);
    const stub = sinon.stub(request, "get").returns(JSON.stringify(fixtures.providersResponse))
    const actual = await AuthAPIClient.getProviderInfos("oauth");
    const expectedGetUri = "https://auth.truelayer.com/api/providers/oauth";
    t.is(stub.getCall(0).args[0].uri, expectedGetUri);
    t.deepEqual(actual, fixtures.providersResponse);
});
