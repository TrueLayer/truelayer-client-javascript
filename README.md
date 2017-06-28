
<p align="center">
	<a href="https://truelayer.com">
		<img src="https://pbs.twimg.com/media/C4n_ff0WIAIYqNj.jpg">
    </a>
	</br>
	<a href="https://doxdox.org/truelayer/truelayer-client-javascript">
		<img src="https://doxdox.org/images/badge-flat.svg">
    </a>
	</br>
	<sup><strong>Detailed documentation on client</sup></strong>
</p>

# TrueLayer
TrueLayer allows financial applications to connect securely with their customer’s bank data. TrueLayer provides a unified interface between multiple financial institutions and third party applications over a common RESTful API. 
For more information and for obtaining a new TrueLayer developer account, visit https://truelayer.com. 

# TrueLayer client library - JavaScript / TypeScript

This is the official TrueLayer API client library. The code base is completely written in Typescript 

## Installation

```bash
npm install truelayer-client
```

## Example usage
* Below is a simple Javascript express app that uses the TrueLayer API client library. It illustrates the flow of obtaining a JWT access token from the authorization server, before using this token to query the data api `/info` endpoint for the identity information of the user.

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
    
    // Call to the Data endpoint using the access token obtained. Eg. call to /info endpoint
    const info = await DataAPIClient.getInfo(tokens.access_token);
    
    res.set("Content-Type", "text/plain");
    res.send(`Access Token: ${JSON.stringify(info, null, 2)}`);
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

# Project structure

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

# Errors
The errors are handled using the APIError class. The errors returned will have the following format:
```json
{
    "name": "error_name",
    "message": "error_message"
}
```

# Tests
The client library has both integration and unit tests.
In order to run the integration tests, an access token needs to be provided. If this is not provided, only the unit tests will be run.

```bash
export access_token=<access_token>
npm run test
```
# Classes

<dl>
<dt><a href="#AuthAPIClient">AuthAPIClient</a></dt>
<dd></dd>
<dt><a href="#DataAPIClient">DataAPIClient</a></dt>
<dd></dd>
</dl>

<a name="AuthAPIClient"></a>

## AuthAPIClient
**Kind**: global class  
**Export**:   

* [AuthAPIClient](#AuthAPIClient)
    * [new AuthAPIClient()](#new_AuthAPIClient_new)
    * [new AuthAPIClient(options)](#new_AuthAPIClient_new)
    * [.getAuthUrl(redirectURI, scope, nonce, [state], [enableMock])](#AuthAPIClient+getAuthUrl) ⇒ <code>string</code>
    * [.exchangeCodeForToken(redirectURI, code)](#AuthAPIClient+exchangeCodeForToken) ⇒ <code>Promise.&lt;IToken&gt;</code>
    * [.refreshAccessToken(refreshToken)](#AuthAPIClient+refreshAccessToken) ⇒ <code>Promise.&lt;IToken&gt;</code>

<a name="new_AuthAPIClient_new"></a>

### new AuthAPIClient()
This class is responsible for performing the authentication steps

<a name="new_AuthAPIClient_new"></a>

### new AuthAPIClient(options)
Creates an instance of AuthAPIClient.
If no constructor options are passed then look for environment variables by default.


| Param | Type |
| --- | --- |
| options | <code>IOptions</code> | 

<a name="AuthAPIClient+getAuthUrl"></a>

### authAPIClient.getAuthUrl(redirectURI, scope, nonce, [state], [enableMock]) ⇒ <code>string</code>
Builds a correctly formatted authentication url

**Kind**: instance method of [<code>AuthAPIClient</code>](#AuthAPIClient)  

| Param | Type |
| --- | --- |
| redirectURI | <code>string</code> | 
| scope | <code>Array.&lt;string&gt;</code> | 
| nonce | <code>string</code> | 
| [state] | <code>string</code> | 
| [enableMock] | <code>boolean</code> | 

<a name="AuthAPIClient+exchangeCodeForToken"></a>

### authAPIClient.exchangeCodeForToken(redirectURI, code) ⇒ <code>Promise.&lt;IToken&gt;</code>
Exchanges an auth code for an access token

**Kind**: instance method of [<code>AuthAPIClient</code>](#AuthAPIClient)  

| Param | Type |
| --- | --- |
| redirectURI | <code>string</code> | 
| code | <code>string</code> | 

<a name="AuthAPIClient+refreshAccessToken"></a>

### authAPIClient.refreshAccessToken(refreshToken) ⇒ <code>Promise.&lt;IToken&gt;</code>
Exchanges a refresh token for a fresh access token

**Kind**: instance method of [<code>AuthAPIClient</code>](#AuthAPIClient)  

| Param | Type |
| --- | --- |
| refreshToken | <code>string</code> | 

<a name="AuthAPIClient"></a>

<a name="DataAPIClient"></a>

## DataAPIClient
Class responsible for calling to the Data endpoints

**Kind**: global class  

* [DataAPIClient](#DataAPIClient)
    * [.callAPI(accessToken, path, [qs])](#DataAPIClient.callAPI) ⇒ <code>Promise.&lt;IResponse.&lt;T&gt;&gt;</code>
    * [.getMe(accessToken)](#DataAPIClient.getMe) ⇒ <code>Promise.&lt;IResponse.&lt;IMe&gt;&gt;</code>
    * [.getInfo(accessToken)](#DataAPIClient.getInfo) ⇒ <code>Promise.&lt;IResponse.&lt;IInfo&gt;&gt;</code>
    * [.getAccounts(accessToken)](#DataAPIClient.getAccounts) ⇒ <code>Promise.&lt;IResponse.&lt;IAccount&gt;&gt;</code>
    * [.getAccount(accessToken, accountId)](#DataAPIClient.getAccount) ⇒ <code>Promise.&lt;IResponse.&lt;IAccount&gt;&gt;</code>
    * [.getTransactions(accessToken, accountId, from, to)](#DataAPIClient.getTransactions) ⇒ <code>Promise.&lt;IResponse.&lt;ITransaction&gt;&gt;</code>
    * [.getBalance(accessToken, accountId)](#DataAPIClient.getBalance) ⇒ <code>Promise.&lt;IResponse.&lt;IBalance&gt;&gt;</code>
    * [.isTokenExpired(accessToken)](#DataAPIClient.isTokenExpired) ⇒ <code>boolean</code>

<a name="DataAPIClient.callAPI"></a>

### DataAPIClient.callAPI(accessToken, path, [qs]) ⇒ <code>Promise.&lt;IResponse.&lt;T&gt;&gt;</code>
Generic API calling function

**Kind**: static method of [<code>DataAPIClient</code>](#DataAPIClient)  
**Template**: T  

| Param | Type |
| --- | --- |
| accessToken | <code>string</code> | 
| path | <code>string</code> | 
| [qs] | <code>object</code> | 

<a name="DataAPIClient.getMe"></a>

### DataAPIClient.getMe(accessToken) ⇒ <code>Promise.&lt;IResponse.&lt;IMe&gt;&gt;</code>
Call to /me API.

**Kind**: static method of [<code>DataAPIClient</code>](#DataAPIClient)  

| Param |
| --- |
| accessToken | 

<a name="DataAPIClient.getInfo"></a>

### DataAPIClient.getInfo(accessToken) ⇒ <code>Promise.&lt;IResponse.&lt;IInfo&gt;&gt;</code>
Call to /info API.

**Kind**: static method of [<code>DataAPIClient</code>](#DataAPIClient)  

| Param | Type |
| --- | --- |
| accessToken | <code>string</code> | 

<a name="DataAPIClient.getAccounts"></a>

### DataAPIClient.getAccounts(accessToken) ⇒ <code>Promise.&lt;IResponse.&lt;IAccount&gt;&gt;</code>
Call to /accounts API.

**Kind**: static method of [<code>DataAPIClient</code>](#DataAPIClient)  

| Param |
| --- |
| accessToken | 

<a name="DataAPIClient.getAccount"></a>

### DataAPIClient.getAccount(accessToken, accountId) ⇒ <code>Promise.&lt;IResponse.&lt;IAccount&gt;&gt;</code>
Call to /accounts/account_id API.

**Kind**: static method of [<code>DataAPIClient</code>](#DataAPIClient)  

| Param |
| --- |
| accessToken | 
| accountId | 

<a name="DataAPIClient.getTransactions"></a>

### DataAPIClient.getTransactions(accessToken, accountId, from, to) ⇒ <code>Promise.&lt;IResponse.&lt;ITransaction&gt;&gt;</code>
Call to /accounts/account_id/transactions API

**Kind**: static method of [<code>DataAPIClient</code>](#DataAPIClient)  

| Param |
| --- |
| accessToken | 
| accountId | 
| from | 
| to | 

<a name="DataAPIClient.getBalance"></a>

### DataAPIClient.getBalance(accessToken, accountId) ⇒ <code>Promise.&lt;IResponse.&lt;IBalance&gt;&gt;</code>
Call to /accounts/account_id/balance API

**Kind**: static method of [<code>DataAPIClient</code>](#DataAPIClient)  

| Param |
| --- |
| accessToken | 
| accountId | 

<a name="DataAPIClient.isTokenExpired"></a>

### DataAPIClient.isTokenExpired(accessToken) ⇒ <code>boolean</code>
Returns whether the token has expired or not

**Kind**: static method of [<code>DataAPIClient</code>](#DataAPIClient)  

| Param | Type |
| --- | --- |
| accessToken | <code>string</code> | 

