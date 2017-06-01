import test from "ava";
import * as TrueLayer from "../../index";

// Build 'options' to pass to APIClient
const options: TrueLayer.IOptions = {
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

const clientAuth = new TrueLayer.V1.ApiClient(options).auth;

test("Get authentication URL - without mock enabled", (t) => {
    t.plan(1);
    const actual = clientAuth.getAuthUrl("http://url", scope, "nonce", "state", false);
    const expected: string = "https://auth.truelayer.com/?response_type=code&response_mode=form_post&client_id=client_id&redirect_uri=http://url&scope=offline_access info accounts transactions balance&nonce=nonce&state=state";
    t.is(actual, expected, "Authentication url does not have the expected value");
});

test("Get authentication URL - with mock enabled", (t) => {
    t.plan(1);
    const actual = clientAuth.getAuthUrl("http://url", scope, "nonce", "state", true);
    const expected: string = "https://auth.truelayer.com/?response_type=code&response_mode=form_post&client_id=client_id&redirect_uri=http://url&scope=offline_access info accounts transactions balance&nonce=nonce&state=state&enable_mock=true";
    t.is(actual, expected, "Authentication url does not have the expected value");
});

test("Get authentication URL - no optional params provided", (t) => {
    t.plan(1);
    const response = clientAuth.getAuthUrl("http://url", scope, "nouce");
    const expectedUrl: string = "https://auth.truelayer.com/?response_type=code&response_mode=form_post&client_id=client_id&redirect_uri=http://url&scope=offline_access info accounts transactions balance&nonce=nouce";
    t.is(response, expectedUrl, "Authentication url does not have the expected value");
});

test("Get authentication URL - invalid url", (t) => {
    const error = t.throws(() => {
        clientAuth.getAuthUrl("url", scope, "nouce");
    });
    t.is(error.message, "Redirect uri provided is invalid", "Authentication url passed validation");
});

test("Exchange code for token - invalid url", async (t) => {
    const error = await t.throws(clientAuth.exchangeCodeForToken("url", "code"));
    t.is(error.message, "Redirect uri provided is invalid", "Authentication url passed validation");
});

// TODO: test case for: clientAuth.isTokenExpired(tokens.access_token);
// TODO: test case for: clientAuth.timeBeforeExpired(tokens.access_token);

// test("Exchange code for token", (t) => {
//     t.plan(1);
//
//     const request = nock("https://auth.truelayer.com", {
//         reqHeaders: {
//             "Content-Type": "application/x-www-form-urlencoded"
//             }
//         })
//         .post("/connect/token", {
//             grant_type: "authorization_code",
//             client_id: this.options.client_id,
//             client_secret: this.options.client_secret,
//             redirect_uri: this.options.redirect_uri,
//             code: "code"
//         })
//         .reply(200, {
//             access_token: "access_token",
//             refresh_token: "refresh_token"
//         });
//
//     const response: Promise<TrueLayer.IAccessTokens> = clientAuth.exchangeCodeForToken("code");
//     const expectedResponse: TrueLayer.IAccessTokens = {
//         access_token: "access_token",
//         refresh_token: "refresh_token"
//     };
//
//     // t.deepEqual(response, expectedResponse, "Access token not as expected");
// });
