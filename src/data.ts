// Imports
import * as request from "request-promise";
import IResponse from "./interfaces/IResponse";
import IOptions from "./interfaces/IOptions";
import C from "./constants";

// Endpoint interfaces
import ITransaction from "./model/transaction";
import IAccount from "./model/account";
import IBalance from "./model/balance";
import IInfo from "./model/info";
import IMe from "./model/me";

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
    public async info(accessToken: string): Promise<IResponse<IInfo>> {
        return this.callAPI<IInfo>(accessToken, `${C.API_HOST}/data/v1/info`);
    }

    /**
     * Call to /me API.
     *
     * @param accessToken
     * @returns {Promise<IResponse<IMe>>}
     */
    public async me(accessToken: string): Promise<IResponse<IMe>> {
        return this.callAPI<IMe>(accessToken, `${C.API_HOST}/data/v1/me`);
    }

    /**
     * Call to /accounts API.
     *
     * @param accessToken
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async accounts(accessToken: string): Promise<IResponse<IAccount>> {
        return this.callAPI<IAccount>(accessToken, `${C.API_HOST}/data/v1/accounts`);
    }

    /**
     * Call to /accounts/account_id API.
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async accountInfo(accessToken: string, accountId: string): Promise<IResponse<IAccount>> {
        return this.callAPI<IAccount>(accessToken, `${C.API_HOST}/data/v1/accounts/${accountId}`);
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
        return this.callAPI<ITransaction>(accessToken, `${C.API_HOST}/data/v1/accounts/${accountId}/transactions`);
    }

    /**
     * Call to /accounts/account_id/balance API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IBalance>>}
     */
    public async balance(accessToken: string, accountId: string): Promise<IResponse<IBalance>> {
        return this.callAPI<IBalance>(accessToken, `${C.API_HOST}/data/v1/accounts/${accountId}/balance`);
    }
}
