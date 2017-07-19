

<p align="center">
	<a href="https://truelayer.com">
		<img src="https://pbs.twimg.com/media/C4n_ff0WIAIYqNj.jpg" />
    </a>
	<br>
	<br>
	<sup><strong>Detailed documentation on client</sup></strong>
</p>

# [TrueLayer](https://truelayer.com) - [Docs](https://docs.truelayer.com)
TrueLayer allows financial applications to connect securely with their customer’s bank data. TrueLayer provides a unified interface between multiple financial institutions and third party applications over a common RESTful API. 
For more information and for obtaining a new TrueLayer developer account, visit https://truelayer.com. 

# TrueLayer client library (JavaScript / TypeScript)

This is the official Typescript client library that helps with the creation of applications that use TrueLayer APIs. Typescript is a typed superset of Javascript that compiles to plain JavaScript. More information regarding Typescript can be found at: https://www.typescriptlang.org/

The truelayer-client-javascript library can be used from either JavaScript (Node.js) or TypeScript.

# Installation

```bash
$ npm install truelayer-client
```

# Usage
Below is a simple Javascript express app using TrueLayer's API client library. It illustrates the flow of obtaining a JWT access token from the authorization server, before using this token to query the data api `/info` endpoint for identity information of the user.

```javascript
const {AuthAPIClient, DataAPIClient} = require("truelayer-client");
const app = require("express")();

const redirect_uri = "http://localhost:5000/truelayer-redirect";

// Create TrueLayer client instance
const client = new AuthAPIClient({
    client_id: "<client_id>",
    client_secret: "<client_secret>"
});

// Generate and redirect to authentication url
app.get("/", (req, res) => {
    // Read JSDocs for descriptions for all parameters
    const authURL = client.getAuthUrl(redirect_uri, ["info"], "nonce", "");
    res.redirect(authURL);
});

// Receiving POST request
app.post("/truelayer-redirect", async (req, res) => {
    // Exchange an authentication code for an access token
    const code = req.body.code;
    const tokens = await client.exchangeCodeForToken(redirect_uri, code);
    
    // Call to the Data endpoint using the access token obtained. Eg. /info endpoint
    const info = await DataAPIClient.getInfo(tokens.access_token);
    
    res.set("Content-Type", "text/plain");
    res.send(`Access Token: ${JSON.stringify(info, null, 2)}`);
});
```

# Examples

A simple sample application has been created and lives in `./examples`. 
In order to run the application, `CLIENT_ID` and `CLIENT_SECRET` need to be set as environment variables. These can be obtained by signing up on https://truelayer.com.
Set the environment variables from the console:

```bash
$ export CLIENT_ID="<client>"
$ export CLIENT_SECRET="<secret>"
```

### [Express](https://expressjs.com/)

This simple example stands up a bare-bones express server that takes a user through the authentication flow and hits the data API endpoints, streaming the results to a page.

```bash
$ cd examples/express
$ npm install
...
$ npm start
```

Once the app is listening, navigate to `http://localhost:5000` and introduce credentials.

# Authentication and tokens

> Note: The code snippets below are extracted from the above Express example.

The flow of authorization follows the protocol of [OAuth 2.0](https://oauth.net/2/). For more information about precisely  how this customer / client authorization is achieved take a look [here](http://docs.truelayer.com/#authentication). This library serves to streamline this flow for developers and can be summarized in the following steps:

1. The first step in authentication is to redirect the user to the TrueLayer Authentication Server. 

    ```javascript
    const authURL = client.getAuthUrl(env.REDIRECT_URI, scope, "nonce", state = "", true);
    res.redirect(authURL);
    ```

2. Upon successful redirect and authentication, a one-time code is generated when the HTTP POST is performed to the redirect_uri provided by the client.

    ```javascript
    app.post("/truelayer-redirect", async (req, res) => {
        const code = req.body.code;
        ...
    });
    ```

3. After the code is obtained, this can be exchanged for an access token.

    ```javascript
    const tokens = await client.exchangeCodeForToken(env.REDIRECT_URI, code);
    ``` 
4. The authorization server will respond with:
    * *access token* - short-lived JWT token (default 1h) used to access data on behalf of the customer
    * *refresh token* - long-lived code used to obtain a new access token

> In the case that the `access_token` has expired, ```refreshAccessToken``` can be used for refreshing the token. This will return new values for both the access_token and refresh_token (old refresh_token no longer valid).

# [Project structure](https://github.com/TrueLayer/truelayer-client-javascript/tree/master/src/v1)

This client library comprises of two pieces of functionality represented by separate classes:

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
    * `getTransactions` - call to the */accounts/{account_id}/transactions* endpoint
    * `getBalance` - call to the */accounts/{account_id}/balance* endpoint
    * `validateToken` - checks whether the current access token is still valid.


# Errors

> **Note:** see [here](http://docs.truelayer.com/#api-response-structure) for more information about error response structure and [here](http://docs.truelayer.com/#error-codes) for more error specific information.

Custom error wrapper classes have been used to handle the auth server and data api errors respectively. Errors on the wire have the following format:

```json
{
    "error": "<error_code>",
    "error_description": "<error_message>"
}
```

The custom `DataApiError` and `AuthApiError` error objects have 2 parameters which related to these properties:
* `error`: error code
* `message`: error description

# Tests
The client library has both integration and unit tests.

> In order to run the integration tests, an access token needs to be provided. If this is not provided, only the unit tests will be run.

```bash
$ export access_token=<access_token>
$ npm run test
```
# Contributions
In order to contribute to the existing code base, please follow these steps: 
* Fork the repo
* Create a new branch (```git checkout -b <improvements-branch>```)
* Make the appropriate changes
* Write tests for the modified code
* Commit changes (```git commit -m "<message>"```)
* Push to the branch (```git push origin <improvements-branch>```)
* Create a pull request
