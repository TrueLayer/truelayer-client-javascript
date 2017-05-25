// Imports
import * as request from "request-promise";
import IOptions from "./IOptions";
import C from "./constants";

// Endpoint interfaces
import IAccount from "./model/info";
import IBalance from "./model/info";
import IInfo from "./model/info";
import IMe from "./model/info";
import ITransaction from "./model/info";

interface IResponse<T> {
    success: boolean;
    error?: IError;
    results?: T | [T];
}

interface IError {
    code: string;
    message?: string;
}

export default class Data {

    // Private
    private readonly options: IOptions;

    // Constructor
    constructor(options: IOptions) {
        this.options = options;
    }

    /**
     * Generic api calling function
     *
     * @private
     * @template T
     * @param {string} accessToken
     * @param {string} path
     * @returns {Promise<IResponse<T>>}
     *
     * @memberof Data
     */
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
     *
     * @param {string} accessToken
     * @returns {Promise<IResponse<IInfo>>}
     */
    // TODO: handle input validation and errors
    public async info(accessToken: string): Promise<IResponse<IInfo>> {
        return this.callAPI<IInfo>(accessToken, `https://${C.AUTH_HOST}/data/v1/info`);
    }

    /**
     * Call to /me API.
     *
     * @param accessToken
     * @returns {Promise<IResponse<IMe>>}
     */
    public async me(accessToken: string): Promise<IResponse<IMe>> {
        return this.callAPI<IMe>(accessToken, `https://${C.AUTH_HOST}/data/v1/me`);
    }

    /**
     * Call to /accounts API.
     *
     * @param accessToken
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async accounts(accessToken: string): Promise<IResponse<IAccount>> {
        return this.callAPI<IAccount>(accessToken, `https://${C.AUTH_HOST}/data/v1/accounts`);
    }

    /**
     * Call to /accounts/account_id API.
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async accountInfo(accessToken: string, accountId: string): Promise<IResponse<IAccount>> {
        return this.callAPI<IAccount>(accessToken, `https://${C.AUTH_HOST}/data/v1/accounts/${accountId}`);
    }

    /**
     * Call to /accounts/account_id/transactions API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<ITransaction>>}
     */
    public async transactions(accessToken: string, accountId: string): Promise<IResponse<ITransaction>> {
        // TODO add to from params
        return this.callAPI<ITransaction>(accessToken, `https://${C.AUTH_HOST}/data/v1/accounts/${accountId}/transactions`);
    }

    /**
     * Call to /accounts/account_id/balance API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IBalance>>}
     */
    public async balance(accessToken: string, accountId: string): Promise<IResponse<IBalance>> {
        return this.callAPI<IBalance>(accessToken, `https://${C.AUTH_HOST}/data/v1/accounts/${accountId}/balance`);
    }
}
