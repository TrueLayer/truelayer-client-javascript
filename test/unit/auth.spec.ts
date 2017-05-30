import test from "ava";
import * as TrueLayer from "../../index";

// Build 'options' to pass to APIClient
const options: TrueLayer.IOptions = {
    client_id: "client_id",
    client_secret: "client_secret"
};

const clientAuth = new TrueLayer.V1.ApiClient(options).auth;

test("Get authentication URL", (t) => {
    t.plan(1);

    const response = clientAuth.getAuthUrl("http://url", "scope", "nonce", false, "state");
    const expectedUrl: string = "https://auth.truelayer.com/?response_type=code&response_mode=form_post&client_id=client_id&redirect_uri=http://url&scope=scope&nonce=nonce&state=state&enable_mock=false";

    t.is(response, expectedUrl, "Authentication url does not have the expected value");
});

test("Get authentication URL - no optional params provided", (t) => {
    t.plan(1);

    const response = clientAuth.getAuthUrl("http://url", "", "");
    const expectedUrl: string = "https://auth.truelayer.com/?response_type=code&response_mode=form_post&client_id=client_id&redirect_uri=http://url&scope=&nonce=";

    t.is(response, expectedUrl, "Authentication url does not have the expected value");
});

test("Get authentication URL - invalid url", (t) => {
    const error = t.throws(() => {
        clientAuth.getAuthUrl("url", "", "");
    });

    t.is(error.message, "Redirect uri provided is invalid", "Authentication url passed validation");
});

test("Exchange code for token - invalid url", async (t) => {
    const error = await t.throws(clientAuth.exchangeCodeForToken("url", "code"));

    t.is(error.message, "Redirect uri provided is invalid", "Authentication url passed validation");
});

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
