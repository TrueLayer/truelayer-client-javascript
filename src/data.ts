import * as request from "request-promise";
import IOptions from "./IOptions";
import C from "./constants";

interface IResponse<T> {
    success: boolean;
    error?: IError;
    results?: T | [T];
}

interface IError {
    code: string;
    message?: string;
}

interface IInfo {
    full_name: string;
    update_timestamp?: string;
    date_of_birth?: string;
    addresses?: [IAddressInfo];
    emails?: [string];
    phones?: [string];
}

interface IAddressInfo {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

interface IAccount {
    update_timestamp: string;
    account_id: string;
    account_type: string;
    display_name?: string;
    description: string;
    currency: string;
    account_number: IAccountNumber;
}

interface IAccountNumber {
    iban: string;
    swift_bic: string;
    number: string;
    sort_code: string;
}

interface IMe {
    provider_id: string;
    credentials_id: string;
    client_id: string;
}

interface ITransaction {
    timestamp: string;
    description: string;
    transaction_type: string;
    amount: number;
    currency: string;
    balance: IBalance;
    meta: object;
}

interface IBalance {
    currency: string;
    available: number;
    current: number;
    update_timestamp: string;
}

export default class Data {

    // Private
    private readonly options: IOptions;

    // Constructor
    constructor(options: IOptions) {
        this.options = options;
    }

    private async callAPI<T>(accessToken: string, path: string): Promise<IResponse<T>> {
        const requestOptions: request.Options = {
            uri: path,
            method: "GET",
            headers: {
                Authorization: "Bearer " + accessToken
            }
        };

        const response: string = await request(requestOptions);
        const parsedResponse: IResponse<T> = JSON.parse(response);
        return parsedResponse;
    }

    /**
     * Call to /info API.
     * @param accessToken
     * @returns {Promise<IResponse>}
     */
    // TODO handle input validation and errors
    public async info(accessToken: string): Promise<IResponse<IInfo>> {
        return this.callAPI<IInfo>(accessToken, `https://api.truelayer.com/data/v1/info`);
    }

    /**
     * Call to /me API.
     * @param accessToken
     * @returns {Promise<IResponse<IMe>>}
     */
    public async me(accessToken: string): Promise<IResponse<IMe>> {
        return this.callAPI<IMe>(accessToken, `https://api.truelayer.com/data/v1/me`);
    }

    /**
     * Call to /accounts API.
     * @param accessToken
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async accounts(accessToken: string): Promise<IResponse<IAccount>> {
        return this.callAPI<IAccount>(accessToken, `https://api.truelayer.com/data/v1/accounts`);
    }

    /**
     * Call to /accounts/account_id API.
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async accountInfo(accessToken: string, accountId: string): Promise<IResponse<IAccount>> {
        return this.callAPI<IAccount>(accessToken, `https://api.truelayer.com/data/v1/accounts/${accountId}`);
    }

    /**
     * Call to /accounts/account_id/transactions API
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<ITransaction>>}
     */
    // // TODO add to from params
    public async transactions(accessToken: string, accountId: string): Promise<IResponse<ITransaction>> {
        return this.callAPI<ITransaction>(accessToken, `https://api.truelayer.com/data/v1/accounts/${accountId}/transactions`);
    }

    /**
     * Call to /accounts/account_id/balance API
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IBalance>>}
     */
    public async balance(accessToken: string, accountId: string): Promise<IResponse<IBalance>> {
        return this.callAPI<IBalance>(accessToken, `https://api.truelayer.com/data/v1/accounts/${accountId}/balance`);
    }
}
