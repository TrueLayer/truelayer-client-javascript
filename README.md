[![npm version](https://badge.fury.io/js/truelayer-client.svg)](//npmjs.com/package/truelayer-client)

<p align="center">
	<a href="https://truelayer.com">
		<img src="https://pbs.twimg.com/media/C4n_ff0WIAIYqNj.jpg" />
    </a>
	<sup><strong>Javascript / Typescript API Client Library</sup></strong>
</p>

# [TrueLayer](https://truelayer.com) - [Docs](https://docs.truelayer.com)
TrueLayer allows financial applications to connect securely with their customer’s bank data. TrueLayer provides a unified interface between multiple financial institutions and third party applications over a common RESTful API. 
For more information and for obtaining a new TrueLayer developer account, visit https://truelayer.com.

<br>

# Client library (JavaScript / TypeScript)

This is the official client library to help with the creation of financial applications that implement TrueLayer APIs. The library has been written in Typescript for a richer development experience. Typescript is a typed superset of Javascript that compiles to plain JavaScript. More information regarding Typescript can be found at: https://www.typescriptlang.org/

The client library can be used within a JavaScript (Node.js) or TypeScript environment.

<br>

# Installation

```bash
$ npm install truelayer-client
```

<br>

# Usage
Below is a simple Javascript express app using TrueLayer's API client library. It illustrates the flow of obtaining a JWT access token from the authorization server, before using this token to query the data api `/info` endpoint for identity information of the user.

> Note: You'll need **node** (*at least > v7.6*) and **npm** or **yarn** to install and run this example.

```javascript
const {AuthAPIClient, DataAPIClient} = require("truelayer-client");
const app = require("express")();

const redirect_uri = "http://localhost:5000/truelayer-redirect";

// Create TrueLayer client instance
const client = new AuthAPIClient({
    client_id: "INSERT YOUR client_id HERE",
    client_secret: "INSERT YOUR client_secret HERE"
});

// Define array of permission scopes
const scopes = ["info", "accounts", "balance", "transactions", "offline_access", "cards"]

// Construct url and redirect to the auth dialog
app.get("/", (req, res) => {
    const authURL = client.getAuthUrl({
        redirectURI: redirect_uri,
        scope: scopes,
        nonce: "foobar"
    });
    res.redirect(authURL);
});

// Retrieve 'code' query-string param, exchange it for access token and hit data api
app.get("/truelayer-redirect", async (req, res) => {
    const code = req.query.code;
    const tokens = await client.exchangeCodeForToken(redirect_uri, code);
    const info = await DataAPIClient.getInfo(tokens.access_token);

    res.set("Content-Type", "text/plain");
    res.send(`Access Token: ${JSON.stringify(info, null, 2)}`);
});

app.listen(5000, () => console.log("Example app listening on port 5000..."));
```

**Create new package**
```bash
$ npm init
```

**Install dependencies**
```bash
$ npm install --save truelayer-client express
```

**Run the app** :video_game:
```bash
$ node your_file.js
```

If all goes well you should be able to navigate to http://localhost:5000 and view the app!

Take a look at our sample repo for an easy to digest implementation of the library.

[TrueLayer node sample app](https://github.com/TrueLayer/truelayer-client-javascript-sample)

<br>

# [Examples](https://github.com/TrueLayer/truelayer-client-javascript-sample)

A simple sample application has been created and lives in a separate repo, **[here](https://github.com/TrueLayer/truelayer-client-javascript-sample)**.

This simple node example stands up a bare-bones express server and takes a user through the authentication flow, then hits the data API `info` endpoint, and streams the results to a page.

<br>

# Authentication and tokens

> Note: The code snippets below are extracted from the above Express example.

The flow of authorization follows the protocol of [OAuth 2.0](https://oauth.net/2/). For more information about precisely  how this customer / client authorization is achieved take a look [here](http://docs.truelayer.com/#authentication). This library serves to streamline this flow for developers and can be summarized in the following steps:

> **Note:** The `responseMode` parameter if omitted will cause the auth server to return the one-time code as a **query-string** parameter. Passing `"form_post"` will intuitively cause the code to be returned as a **form/post** parameter.

1. The first step in authentication is to redirect the user to the TrueLayer Authentication Server. 

    ```javascript
    const authURL = client.getAuthUrl({
        redirectURI: env.REDIRECT_URI,
        scope,
        nonce: "nonce",
        responseMode: "form_post"
    });
    res.redirect(authURL);
    ```

2. Upon successful redirect and authentication, a one-time code is generated when the HTTP POST is performed to the redirect_uri provided by the client.

    ```javascript
    app.post("/truelayer-redirect", async (req, res) => {
        const code = req.body.code;
        ...
    });
    ```

3. After the code is obtained, it can be exchanged for an access token.

    ```javascript
    const tokens = await client.exchangeCodeForToken(env.REDIRECT_URI, code);
    ``` 
4. The authorization server will respond with:
    * *access token* - short-lived JWT token (default 1h) used to access data on behalf of the customer
    * *refresh token* - long-lived code used to obtain a new access token

> In the case that the `access_token` has expired, ```refreshAccessToken``` can be used for refreshing the token. This will return new values for both the access_token and refresh_token (old refresh_token no longer valid).

<br>

# [Project structure](https://github.com/TrueLayer/truelayer-client-javascript/tree/master/src/v1)

This client library consists of two core pieces of functionality, each represented by a separate class:

#### 1. Authentication - [AuthAPIClient](https://github.com/TrueLayer/truelayer-client-javascript/tree/master/src/v1#authapiclient)
* This is responsible for providing methods that allow developers to perform customer authentication and client authorization.
* The following methods are provided in AuthAPIClient:
    * `getAuthUrl` - builds a correctly formatted authentication url used for redirection to the authentication server.
    * `exchangeCodeForToken` - exchanges an authentication code for an access token
    * `refreshAccessToken` - refreshes the access token using the refresh token. Access tokens expire after a set period of time (default 1h). 

#### 2. Data APIs - [DataAPIClient](https://github.com/TrueLayer/truelayer-client-javascript/tree/master/src/v1#DataAPIClient)
* Once the authentication is successful, methods are provided for calling the various API endpoints for obtaining information regarding the authenticated bank account such as : accounts, balance, transactions etc.
* The following methods are provided in DataAPIClient:
    * `getMe` - call to the */me* endpoint
    * `getInfo` - call to the */info* endpoint

    * `getAccounts` - call to the */accounts* endpoint
    * `getAccount` - call to the */accounts/{account_id}* endpoint
    * `getDirectDebits` - call to the */accounts/{account_id}/direct_debits* endpoint
    * `getStandingOrders` - call to the */accounts/{account_id}/standing_orders* endpoint
    * `getTransactions` - call to the */accounts/{account_id}/transactions* endpoint
    * `getPendingTransactions` - call to the */accounts/{account_id}/transactions/pending* endpoint
    * `getBalance` - call to the */accounts/{account_id}/balance* endpoint

    * `getCards` - call to the */cards* endpoint
    * `getCard` - call to the */cards/{account_id}* endpoint
    * `getCardTransactions` - call to the */cards/{account_id}/transactions* endpoint
    * `getCardPendingTransactions` - call to the */cards/{account_id}/transactions/pending* endpoint
    * `getCardBalance` - call to the */cards/{account_id}/balance* endpoint

    * `validateToken` - checks whether the current access token is still valid.

<br>

# Errors

> **Note:** see [here](http://docs.truelayer.com/#api-response-structure) for more information about error response structure and [here](http://docs.truelayer.com/#error-codes) for more error specific information.

Custom error wrapper classes have been used to handle the auth server and data api errors respectively. Errors on the wire have the following format:

```json
{
    "error": "<error_code>",
    "error_description": "<error_description>"
}
```

The custom `DataApiError` and `AuthApiError` error objects have 2 parameters which relate to these properties:
* `error`: error code
* `message`: error description

<br>

# Tests
The client library has both integration and unit tests.

> In order to run the integration tests, an access token needs to be provided. If this is not provided, only the unit tests will be run.

```bash
$ export access_token=<access_token>
$ npm run test
```

<br>

# Contributions
In order to contribute to the existing code base, please follow these steps: 
* Fork the repo
* Create a new branch (```git checkout -b <improvements-branch>```)
* Make the appropriate changes
* Write tests for the modified code
* Commit changes (```git commit -m "<message>"```)
* Push to the branch (```git push origin <improvements-branch>```)
* Create a pull request
