# TrueLayer
TrueLayer allows financial applications to connect securely with their customer’s bank data. TrueLayer provides a unified interface between multiple financial institutions and third party applications over a common RESTful API. 
For more information and for obtaining a new TrueLayer developer account, visit https://truelayer.com. 

# TrueLayer client library - Javascript 

This is the official Typescript client library that helps with the creation of applications that use TrueLayer APIs.

## Installation

```bash
npm install truelayer-client
```

## Example usage
* This is a simple Javascript example on how to create an express app that uses the client library.

```javascript
const Express = require("express");
const {AuthAPIClient, DataAPIClient} = require("truelayer-client");

// Create Express instance
const app = Express();

// Create TrueLayer client instance
const client = new AuthAPIClient({
    client_id: "<client_id>",
    client_secret: "<client_secret>"
});

const redirect_uri = "http://localhost:5000/truelayer-redirect";

// Redirect to the authentication server
app.get("/", (req, res) => {
    // read JSDocs for descriptions for all parameters
    const authURL = client.getAuthUrl(redirect_uri, ["info"], "nonce", "");
    res.redirect(authURL);
});

// Receiving POST request
app.post("/truelayer-redirect", async (req, res) => {
    // Exchange an authentication code for an access token
    const code = req.body.code;
    const tokens = await client.exchangeCodeForToken(redirect_uri, code);
    
    // Call to any of the Data endpoints using the access token obtained. Eg. call to /info endpoint
    const info = await DataAPIClient.getInfo(tokens.access_token);
    console.log("Info: " + JSON.stringify(info));
    
    res.set("Content-Type", "text/plain");
    res.send(`Access Token: ${JSON.stringify(tokens.access_token)}`);
});

```


* Two sample applications have been created and are available to run from the `./examples` folder.
In order to run the examples, `CLIENT_ID` and `CLIENT_SECRET` need to be set as environment variables. These can be obtained by signing up on https://truelayer.com.
Set the environment variables from the console:
```bash
export CLIENT_ID="<client>"
export CLIENT_SECRET="<secret>"
```

### Express example
This example simply prints to console output from all the methods provided on top of the Authentication APIs and Resource APIs. Run it from the command line:

```bash
node examples/express/app.js
```

Once the app is listening, navigate to `http://localhost:5000` and introduce credentials.

### Koa-marko example
In order to run this example, just run from the command line:
```bash
node examples/koa-marko/server.js
```

## Project structure
This client library comprises of two pieces of functionality represented by separate classes:
1. Authentication - [AuthAPIClient](./src/v1/AuthAPIClient.ts)
* This is responsible for providing methods that allow developers to perform customer authentication and client authorization.
* The following methods are provided in AuthAPIClient:
    * `getAuthUrl` - builds a correctly formatted authentication url used for redirection to the authentication server.
    * `exhangeCodeForToken` - exchanges an authentication code for an access token
    * `refreshAccessToken` - refreshes the access token using the refresh token. Access tokens expire after a set period of time (default 1h). 
    * `isTokenExpired` - checks whether the current access token is still valid.

2. Resource APIs - [DataAPIClient](./src/v1/DataAPIClient.ts)
* Once the authentication is successful, methods are provided for calling the various API endpoints for obtaining information regarding the authenticated bank account such as : accounts, balance, transactions etc.
* The following methods are provided in DataAPIClient:
    * `getMe` - call to the */me* endpoint
    * `getInfo` - call to the */info* endpoint
    * `getAccounts` - call to the */accounts* endpoint
    * `getAccount` - call to the */accounts/{account_id}* endpoint
    * `getTransactions` - call to the */accounts/{account_id}/transactions* endpoint
    * `getBalance` - call to the */accounts/{account_id}/balance* endpoint

### Errors
The errors are handled using the APIError class. The errors returned will have the following format:
```json
{
    "name": "error_name",
    "message": "error_message"
}
```


## Tests
The client library has both integration and unit tests.
In order to run the integration tests, an access token needs to be provided. If this is not provided, only the unit tests will be run.

```bash
export access_token=<access_token>
npm run test
```
