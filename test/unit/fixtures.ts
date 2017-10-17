import { Constants } from "../../src/v1/Constants";
import { IMe } from "../../src/v1/interfaces/data/IMe";
import { IResult } from "../../src/v1/interfaces/data/IResponse";
import { IInfo } from "../../src/v1/interfaces/data/IInfo";
import { IAccount } from "../../src/v1/interfaces/data/IAccount";
import { IBalance } from "../../src/v1/interfaces/data/IBalance";
import { ITransaction } from "../../src/v1/interfaces/data/ITransaction";

import { ICard } from "../../src/v1/interfaces/data/ICard";
import { ICardBalance } from "../../src/v1/interfaces/data/ICardBalance";
import { ICardTransaction } from "../../src/v1/interfaces/data/ICardTransaction";

export class Fixtures {

    // Expired access token
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
        uri: `${Constants.API_URL}/data/v1/info`,
        headers: {
            Authorization: "Bearer " + this.accessToken
        },
        timeout: Constants.API_TIMEOUT
    };

    // Expected object response string for buildRequestOptions() with required params
    public readonly requestOptionsQs: object = {
        uri: `${Constants.API_URL}/data/v1/info`,
        headers: {
            Authorization: "Bearer " + this.accessToken
        },
        timeout: Constants.API_TIMEOUT,
        qs: {
            from: "2017-04-20",
            to: "2017-04-30"
        }
    };

    // Expected /Me json response
    public readonly authResponse: string =
        `{
            "access_token": "test_access_token",
            "expires_in": 3600,
            "token_type": "Bearer",
            "refresh_token": "test_refresh_token"
        }`;

    // Expected /Me json response
    public readonly meResponse: IResult<IMe> =
        {
            results: [
                {
                    client_id: "test",
                    credentials_id: "6L7RxyPKX0THy1tw93PB4V+ 8DB+KjnX9Pxa451yXPu0=",
                    provider_id: "lloyds"
                }
            ]
        };

    // Expected /Info json response string
    public readonly infoResponse: IResult<IInfo> =
        {
            results: [
                {
                    addresses: [
                        {
                            address: "1 Market Street",
                            city: "San Francisco",
                            country: "US",
                            zip: "94103"
                        }
                    ],
                    date_of_birth: "1984-07-03T00:00:00",
                    emails: [
                        "john@doe.com"
                    ],
                    full_name: "John Doe",
                    phones: [
                        "+14151234567"
                    ],
                    update_timestamp: "0001-01-01T00:00:00Z"
                }
            ]
        };

    // Expected /Accounts json response string
    public readonly accountsResponse: IResult<IAccount> =
        {
            results: [
                {
                    update_timestamp: "2017-02-07T17: 29:24.740802Z",
                    account_id: "f1234560abf9f57287637624def390871",
                    account_type: "TRANSACTION",
                    display_name: "Club Lloyds",
                    provider: {
                        display_name: "Mock",
                        provider_id: "mock",
                        logo_uri: "https://auth.truelayer.com/img/banks/banks-icons/mock-icon.svg"
                    },
                    currency: "GBP",
                    account_number: {
                        iban: "GB35LOYD12345678901234",
                        number: "12345678",
                        sort_code: "12-34 - 56"
                    }
                },
                {
                    update_timestamp: "2017-02-07T17: 29:24.740802Z",
                    account_id: "f1234560abf9f57287637624def390872",
                    account_type: "SAVING",
                    display_name: "Club Lloyds",
                    provider: {
                        display_name: "Mock",
                        provider_id: "mock",
                        logo_uri: "https://auth.truelayer.com/img/banks/banks-icons/mock-icon.svg"
                    },
                    currency: "GBP",
                    account_number: {
                        iban: "GB35LOYD12345678901235",
                        number: "12345679",
                        sort_code: "12-34 - 57"
                    }
                }
            ]
        };

    // Expected /Accounts/{id} json response
    public readonly accountResponse: IResult<IAccount> =
        {
            results: [
                {
                    update_timestamp: "2017-02 - 07T17: 29:24.740802Z",
                    account_id: "f1234560abf9f57287637624def390871",
                    account_type: "TRANSACTION",
                    display_name: "Club Lloyds",
                    provider: {
                        display_name: "Mock",
                        provider_id: "mock",
                        logo_uri: "https://auth.truelayer.com/img/banks/banks-icons/mock-icon.svg"
                    },
                    currency: "GBP",
                    account_number: {
                        iban: "GB35LOYD12345678901234",
                        number: "12345678",
                        sort_code: "12-34 - 56"
                    }
                }
            ]
        };

    // Expected /Accounts/{id}/Balance json response
    public readonly accountBalanceResponse: IResult<IBalance> =
        {
            results: [
                {
                    currency: "GBP",
                    available: 1161.2,
                    current: 1161.2,
                    update_timestamp: "2017-02 - 07T17: 33:30.001222Z"
                }
            ]
        };

    // Expected /Accounts/{id}/Transactions json response
    public readonly accountTransactionsResponse: IResult<ITransaction> =
        {
            results: [
                {
                    timestamp: "2017-02 - 01T00: 00:00+00:00",
                    description: "INTEREST (GROSS)",
                    transaction_id: "239a35851d9fc833f1ec748f6efc8097",
                    transaction_type: "CREDIT",
                    amount: 0.77,
                    currency: "GBP",
                    meta: {}
                },
                {
                    timestamp: "2017-02 - 01T00: 00:00+00:00",
                    description: "O/D USAGE FEE",
                    transaction_id: "16a5f86e9da92d86aed9ad02bbce2f47",
                    transaction_type: "DEBIT",
                    amount: -6,
                    currency: "GBP",
                    meta: {
                        transaction_type: "CHARGE"
                    }
                },
                {
                    timestamp: "2017-01 - 30T00: 00:00+00:00",
                    description: "INTEREST (GROSS)",
                    transaction_id: "5b9bc882d3feefe3c5d081bd4cb96f7c",
                    transaction_type: "CREDIT",
                    amount: 0.77,
                    currency: "GBP",
                    meta: {}
                },
                {
                    timestamp: "2017-02 - 01T00: 00:00+00:00",
                    description: "O/D USAGE FEE",
                    transaction_id: "c1b3a5129487f96d03d22f66c2b57139",
                    transaction_type: "DEBIT",
                    amount: -6,
                    currency: "GBP",
                    meta: {
                        transaction_type: "CHARGE"
                    }
                },
                {
                    timestamp: "2017-01 - 30T00: 00:00+00:00",
                    description: "THAMES WATER",
                    transaction_id: "4114e18ec809c5ca5cafbf38fcf5aa5f",
                    transaction_type: "DEBIT",
                    amount: -33.93,
                    currency: "GBP",
                    meta: {
                        transaction_type: "DIRECT_DEBIT"
                    }
                },
                {
                    timestamp: "2017-01 - 19T00: 00:00+00:00",
                    description: "L B I COUNCIL TAX",
                    transaction_id: "206c10209cd96477ccb39a9adf802b88",
                    transaction_type: "DEBIT",
                    amount: -148,
                    currency: "GBP",
                    meta: {
                        transaction_type: "DIRECT_DEBIT"
                    }
                },
                {
                    timestamp: "2017-01 - 16T00: 00:00+00:00",
                    description: "TV LICENCE MBP",
                    transaction_id: "dd567a32d4a1ca05b158ed3c2cebf077",
                    transaction_type: "DEBIT",
                    amount: -24.25,
                    currency: "GBP",
                    meta: {
                        transaction_type: "DIRECT_DEBIT"
                    }
                },
                {
                    timestamp: "2017-01 - 03T00: 00:00+00:00",
                    description: "ACME LIMITED",
                    transaction_id: "61601c817818c476495709cde9bc82df",
                    transaction_type: "CREDIT",
                    amount: 12345.67,
                    currency: "GBP",
                    meta: {
                        transaction_type: "FASTER_PAYMENTS_INCOMING"
                    }
                }
            ]
        };

    // Expected /Cards json response
    public readonly cardsResponse: IResult<ICard> =
        {
            results: [
                {
                    account_id: "cfc2bcf7a405fed81ec8a777213baf59",
                    card_network: "VISA",
                    card_type: "CREDIT",
                    currency: "GBP",
                    display_name: "Platinum super",
                    provider: {
                        display_name: "Mock",
                        provider_id: "mock",
                        logo_uri: "https://auth.truelayer.com/img/banks/banks-icons/mock-icon.svg"
                    },
                    partial_card_number: "6589",
                    update_timestamp: "2017-10-12T06:47:22.4606763Z"
                },
                {
                    account_id: "f76c93e41ca4b6e8de429087130663df",
                    card_network: "MASTERCARD",
                    card_type: "CREDIT",
                    currency: "GBP",
                    display_name: "Everyday",
                    provider: {
                        display_name: "Mock",
                        provider_id: "mock",
                        logo_uri: "https://auth.truelayer.com/img/banks/banks-icons/mock-icon.svg"
                    },
                    partial_card_number: "1101",
                    update_timestamp: "2017-10-12T06:47:22.4606768Z"
                }
            ]
        };

    // Expected /Cards/{id} json response
    public readonly cardResponse: IResult<ICard> =
        {
            results: [
                {
                    account_id: "cfc2bcf7a405fed81ec8a777213baf59",
                    card_network: "VISA",
                    card_type: "CREDIT",
                    currency: "GBP",
                    display_name: "Platinum super",
                    provider: {
                        display_name: "Mock",
                        provider_id: "mock",
                        logo_uri: "https://auth.truelayer.com/img/banks/banks-icons/mock-icon.svg"
                    },
                    partial_card_number: "6589",
                    update_timestamp: "2017-10-12T07:05:04.4471252Z"
                }
            ]
        };
    
    // Expected /Cards/{id}/Balance json response
    public readonly cardBalanceResponse: IResult<ICardBalance> =
        {
            results: [
                {
                    currency: "GBP",
                    available: 5479.0,
                    current: 21.0,
                    credit_limit: 5500.0,
                    last_statement_date: "2017-10-02T00:00:00",
                    last_statement_balance: 420.0,
                    payment_due: 5.0,
                    payment_due_date: "2017-11-01T00:00:00",
                    update_timestamp: "2017-10-12T07:17:54.8144949Z"
                }
            ]
        }

    public readonly cardTransactionsResponse: IResult<ICardTransaction> =
        {
            results: [
                {
                    timestamp: "2017-10-06T00:00:00",
                    description: "ATM",
                    transaction_id: "a4bb6ccd8ea5b0d0e2ff9c1dd473c675",
                    amount: -85.0,
                    currency: "GBP",
                    meta: {
                        type: "Cash Point"
                    }
                },
                {
                    timestamp: "2017-10-06T00:00:00",
                    description: "ATM",
                    transaction_id: "33aedca69d496d1e9c12934da2c33149",
                    amount: -85.0,
                    currency: "GBP",
                    meta: {
                        type: "Cash Point"
                    }
                },
                {
                    timestamp: "2017-10-09T00:00:00",
                    description: "Rent",
                    transaction_id: "a8912726fb215e5dd67a2e5ccc6359fe",
                    amount: -700.0,
                    currency: "GBP",
                    meta: {
                        type: "Standing Order"
                    }
                },
                {
                    timestamp: "2017-10-09T00:00:00",
                    description: "Energy",
                    transaction_id: "b12d220e1eee58a88bc66b32c55c0326",
                    amount: -24.99,
                    currency: "GBP",
                    meta: {
                        type: "Standing Order"
                    }
                }
            ]
        }
}
