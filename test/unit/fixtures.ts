import IResponse from "./../../src/v1/interfaces/data/IResponse";
import IMe from "./../../src/v1/interfaces/data/IMe";
import IInfo from "./../../src/v1/interfaces/data/IInfo";
import IAccount from "./../../src/v1/interfaces/data/IAccount";
import IBalance from "./../../src/v1/interfaces/data/IBalance";
import ITransaction from "./../../src/v1/interfaces/data/ITransaction";
import C from "./../../src/v1/constants";

export default class Fixtures {

    public readonly accessToken: string =
        `eyJhbGciOiJSUzI1NiIsImtpZCI6IjE0NTk4OUIwNTdDOUMzMzg0MDc4MDBBOEJBNkNCOUZFQjMzRTk1MTAiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJGRm1Kc0ZmSnd6` +
        `aEFlQUNvdW15NV9yTS1sUkEifQ.eyJuYmYiOjE0OTYyNDgzMzUsImV4cCI6MTQ5NjI1MTkzNSwiaXNzIjoiaHR0cHM6Ly9hdXRoLnRydWVsYXllci5jb20iLCJhd` +
        `WQiOlsiaHR0cHM6Ly9hdXRoLnRydWVsYXllci5jb20vcmVzb3VyY2VzIiwicmVzb3VyY2VfYXBpIl0sImNsaWVudF9pZCI6WyJ0ZXN0IiwidGVzdCJdLCJzdWIiO` +
        `iIyRmZoSlBGOGE2aWJZOGcxMGZYYnU4MzExcmdyMWFZNDl5MmZ0b215by93PSIsImF1dGhfdGltZSI6MTQ5NjI0ODMzMywiaWRwIjoibG9jYWwiLCJjb25uZWN0b` +
        `3JfaWQiOiJtb2NrIiwiY3JlZGVudGlhbHNfa2V5IjoiNTRhNmNjZWM2YjdkMzY2OGE0ZDliNDRlYmQ1MTdiNDRmYmNlMjIxZGJjNDYxMzQ0MGY1ZDdkYTQwNDc4Y` +
        `mQxYiIsInNjb3BlIjpbImluZm8iLCJhY2NvdW50cyIsInRyYW5zYWN0aW9ucyIsImJhbGFuY2UiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.B4N9` +
        `frsmPjv8wYogeFIq6elkgb_ZFHECInD5IFuY8oV3dsUUnmeS08T9xnENmGQ4nRZaFFNNVaZ_IPrMoQtJh6PuHmKwi0xc4Enifg-_IzR1LRBPmA7Nv55FO7kw7-mA` +
        `tU70y3GAcuf-FOVcXs0wYmfPJHY8KLt0EwSQzvqUi3TViKdUOYZuV3KQP8B-0ZgLhCbFlZ4yAKQ9iX2G8ZIP7t_vWqJwgaD1PpD6R2ydBWxJZEKb7MNA1ng_rak6` +
        `9gW8du5KIeNaWCtn2q9YKOBsp-p0HRi1cfKmtFMxTXZnxoO-2_4NbxD7p0qacrxB0uIwUlDZ32hUo6lX5gtgDjLK9A`;

    // Expected object response string for buildRequestOptions() with required params
    public readonly requestOptions: object = {
        uri: `${C.API_HOST}/data/v1/info`,
        method: "GET",
        headers: {
            Authorization: "Bearer " + this.accessToken
        }
    };

    // Expected object response string for buildRequestOptions() with required params
    public readonly requestOptionsQs: object = {
        uri: `${C.API_HOST}/data/v1/info`,
        method: "GET",
        headers: {
            Authorization: "Bearer " + this.accessToken
        },
        qs: {
            from: "2017-04-20",
            to: "2017-04-30"
        }
    };

    // Expected /Me json response
    public readonly meResponse: IResponse<IMe> = JSON.parse(
        `{
            "success": true,
            "results": [
                {
                    "client_id": "test",
                    "credentials_id": "6L7RxyPKX0THy1tw93PB4V+ 8DB+KjnX9Pxa451yXPu0=",
                    "provider_id": "lloyds"
                }
            ]
        }`);

    // Expected /Info json response string
    public readonly infoResponse: IResponse<IInfo> = JSON.parse(
        `{
            "success": true,
            "results": [
                {
                    "addresses": [
                        {
                            "address": "1 Market Street",
                            "city": "San Francisco",
                            "country": "US",
                            "zip": "94103"
                        }
                    ],
                    "date_of_birth": "1984-07-03T00:00:00",
                    "emails": [
                        "john@doe.com"
                    ],
                    "full_name": "John Doe",
                    "phones": [
                        "+14151234567"
                    ],
                    "update_timestamp": "0001-01-01T00:00:00Z"
                }
            ]
        }`);

    // Expected /Accounts json response string
    public readonly accountsResponse: IResponse<IAccount> = JSON.parse(
        `{
            "success": true,
            "results": [
                {
                    "update_timestamp": "2017-02 - 07T17: 29:24.740802Z",
                    "account_id": "f1234560abf9f57287637624def390871",
                    "account_type": "TRANSACTION",
                    "display_name": "Club Lloyds",
                    "currency": "GBP",
                    "account_number": {
                        "iban": "GB35LOYD12345678901234",
                        "number": "12345678",
                        "sort_code": "12-34 - 56"
                    }
                },
                {
                    "update_timestamp": "2017-02 - 07T17: 29:24.740802Z",
                    "account_id": "f1234560abf9f57287637624def390872",
                    "account_type": "SAVING",
                    "display_name": "Club Lloyds",
                    "currency": "GBP",
                    "account_number": {
                        "iban": "GB35LOYD12345678901235",
                        "number": "12345679",
                        "sort_code": "12-34 - 57"
                    }
                }
            ]
        }`);

    // Expected /Accounts/{id} json response
    public readonly accountResponse: IResponse<IAccount> = JSON.parse(
        `{
            "success": true,
            "results": [
                {
                    "update_timestamp": "2017-02 - 07T17: 29:24.740802Z",
                    "account_id": "f1234560abf9f57287637624def390871",
                    "account_type": "TRANSACTION",
                    "display_name": "Club Lloyds",
                    "currency": "GBP",
                    "account_number": {
                        "iban": "GB35LOYD12345678901234",
                        "number": "12345678",
                        "sort_code": "12-34 - 56"
                    }
                }
            ]
        }`);

    // Expected /Balance json response
    public readonly balanceResponse: IResponse<IBalance> = JSON.parse(
        `{
            "success": true,
            "results": [
                {
                    "currency": "GBP",
                    "available": 1161.2,
                    "current": 1161.2,
                    "update_timestamp": "2017-02 - 07T17: 33:30.001222Z"
                }
            ]
        }`);

    // Expected /Transactions json response
    public readonly transactionsResponse: IResponse<ITransaction> = JSON.parse(
        `{
            "success": true,
            "results": [
                {
                    "timestamp": "2017-02 - 01T00: 00:00+00:00",
                    "description": "INTEREST (GROSS)",
                    "transaction_type": "CREDIT",
                    "amount": 0.77,
                    "currency": "GBP",
                    "meta": {}
                },
                {
                    "timestamp": "2017-02 - 01T00: 00:00+00:00",
                    "description": "O/D USAGE FEE",
                    "transaction_type": "DEBIT",
                    "amount": -6,
                    "currency": "GBP",
                    "meta": {
                        "transaction_type": "CHARGE"
                    }
                },
                {
                    "timestamp": "2017-01 - 30T00: 00:00+00:00",
                    "description": "THAMES WATER",
                    "transaction_type": "DEBIT",
                    "amount": -33.93,
                    "currency": "GBP",
                    "meta": {
                        "transaction_type": "DIRECT_DEBIT"
                    }
                },
                {
                    "timestamp": "2017-01 - 19T00: 00:00+00:00",
                    "description": "L B I COUNCIL TAX",
                    "transaction_type": "DEBIT",
                    "amount": -148,
                    "currency": "GBP",
                    "meta": {
                        "transaction_type": "DIRECT_DEBIT"
                    }
                },
                {
                    "timestamp": "2017-01 - 16T00: 00:00+00:00",
                    "description": "TV LICENCE MBP",
                    "transaction_type": "DEBIT",
                    "amount": -24.25,
                    "currency": "GBP",
                    "meta": {
                        "transaction_type": "DIRECT_DEBIT"
                    }
                },
                {
                    "timestamp": "2017-01 - 03T00: 00:00+00:00",
                    "description": "ACME LIMITED",
                    "transaction_type": "CREDIT",
                    "amount": 12345.67,
                    "currency": "GBP",
                    "meta": {
                        "transaction_type": "FASTER_PAYMENTS_INCOMING"
                    }
                }
            ]
        }`);

}
