import test from "ava";
import * as TrueLayer from "./../../index";

// -- Assertions --
// .pass([message])
// .fail([message])
// .truthy(value, [message])
// .falsy(value, [message])
// .true(value, [message])
// .false(value, [message])
// .is(value, expected, [message])
// .not(value, expected, [message])
// .deepEqual(value, expected, [message])
// .notDeepEqual(value, expected, [message])
// .throws(function|promise, [error, [message]])
// .regex(contents, regex, [message])
// .notRegex(contents, regex, [message])
// .ifError(error, [message])
// .snapshot(contents, [message])

// Get access token
const access_token: string = process.env.access_token;
const client_id: string = process.env.client_id;
const client_secret: string = process.env.client_secret;
const redirect_uri: string = process.env.redirect_uri;

// Build 'options' to pass to APIClient
const options: TrueLayer.IOptions = {
    client_id,
    client_secret,
    redirect_uri
};

const client = new TrueLayer.V1.ApiClient(options);
const clientData = client.data;

test("Get from Info with valid access token returns success", async (t) => {
    t.plan(1);
    const response: TrueLayer.IResponse<TrueLayer.IInfo> = await clientData.info(access_token);
    t.true(response.success);
});

// test("Get from Accounts with valid access token returns success", async (t) => {
//     t.is(, 'foo');
// });

// test("Get from info with valid access token returns success", async (t) => {
//     t.is(, 'foo');
// });

// test("Get from info with valid access token returns success", async (t) => {
//     t.is(, 'foo');
// });

// test("Get from info with valid access token returns success", async (t) => {
//     t.is(, 'foo');
// });

// test("Get from info with valid access token returns success", async (t) => {
//     t.is(, 'foo');
// });
