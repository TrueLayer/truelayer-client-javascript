# truelayer-client-javascript *1.0.0*

> Typescript client library for Truelayer public api (oauth2)


### dist/src/v1/AuthAPIClient.js


#### new AuthAPIClient() 

This class is responsible for performing the authentication steps






##### Returns


- `Void`



#### AuthAPIClient.constructor(options) 

Creates an instance of AuthAPIClient.
If no constructor options are passed then look for environment variables by default.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options | `IOptions`  |  | &nbsp; |




##### Returns


- `Void`



#### AuthAPIClient.getAuthUrl(redirectURI, scope, nonce[, state, enableMock]) 

Builds a correctly formatted authentication url




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| redirectURI | `string`  |  | &nbsp; |
| scope | `Array.<string>`  |  | &nbsp; |
| nonce | `string`  |  | &nbsp; |
| state | `string`  |  | *Optional* |
| enableMock | `boolean`  |  | *Optional* |




##### Returns


- `string`  



#### AuthAPIClient.isValidScope(grant)  *private method*

Validates that a given string is a correct scope literal




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| grant | `string`  |  | &nbsp; |




##### Returns


- `boolean`  



#### AuthAPIClient.exchangeCodeForToken(redirectURI, code) 

Exchanges an auth code for an access token




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| redirectURI | `string`  |  | &nbsp; |
| code | `string`  |  | &nbsp; |




##### Returns


- `Promise.&lt;IToken&gt;`  



#### AuthAPIClient.refreshAccessToken(refreshToken) 

Exchanges a refresh token for a fresh access token




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| refreshToken | `string`  |  | &nbsp; |




##### Returns


- `Promise.&lt;IToken&gt;`  




### dist/src/v1/DataAPIClient.js


#### new DataAPIClient() 

Class responsible for calling to the Data endpoints






##### Returns


- `Void`



#### DataAPIClient.callAPI(accessToken, path[, qs]) 

Generic API calling function




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| accessToken | `string`  |  | &nbsp; |
| path | `string`  |  | &nbsp; |
| qs | `object`  |  | *Optional* |




##### Returns


- `Promise.&lt;IResponse.&lt;T&gt;&gt;`  



#### DataAPIClient.buildRequestOptions(accessToken, path[, qs])  *private method*

Build Request options




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| accessToken | `string`  |  | &nbsp; |
| path | `string`  |  | &nbsp; |
| qs | `object`  |  | *Optional* |




##### Returns


- `request.Options`  



#### DataAPIClient.getMe(accessToken) 

Call to /me API.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| accessToken |  |  | &nbsp; |




##### Returns


- `Promise.&lt;IResponse.&lt;IMe&gt;&gt;`  



#### DataAPIClient.getInfo(accessToken) 

Call to /info API.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| accessToken | `string`  |  | &nbsp; |




##### Returns


- `Promise.&lt;IResponse.&lt;IInfo&gt;&gt;`  



#### DataAPIClient.getAccounts(accessToken) 

Call to /accounts API.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| accessToken |  |  | &nbsp; |




##### Returns


- `Promise.&lt;IResponse.&lt;IAccount&gt;&gt;`  



#### DataAPIClient.getAccount(accessToken, accountId) 

Call to /accounts/account_id API.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| accessToken |  |  | &nbsp; |
| accountId |  |  | &nbsp; |




##### Returns


- `Promise.&lt;IResponse.&lt;IAccount&gt;&gt;`  



#### DataAPIClient.getTransactions(accessToken, accountId, from, to) 

Call to /accounts/account_id/transactions API




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| accessToken |  |  | &nbsp; |
| accountId |  |  | &nbsp; |
| from |  |  | &nbsp; |
| to |  |  | &nbsp; |




##### Returns


- `Promise.&lt;IResponse.&lt;ITransaction&gt;&gt;`  



#### DataAPIClient.getBalance(accessToken, accountId) 

Call to /accounts/account_id/balance API




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| accessToken |  |  | &nbsp; |
| accountId |  |  | &nbsp; |




##### Returns


- `Promise.&lt;IResponse.&lt;IBalance&gt;&gt;`  



#### DataAPIClient.isTokenExpired(accessToken) 

Returns whether the token has expired or not




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| accessToken | `string`  |  | &nbsp; |




##### Returns


- `boolean`  




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
