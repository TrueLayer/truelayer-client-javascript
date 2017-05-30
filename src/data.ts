// Imports
import * as request from "request-promise";
import * as moment from "moment";
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
     * Generic API calling function
     *
     * @private
     * @template T
     * @param {string} accessToken
     * @param {string} path
     * @param {object} [qs]
     * @returns {Promise<IResponse<T>>}
     */
    private async callAPI<T>(accessToken: string, path: string, qs?: object): Promise<IResponse<T>> {
        const requestOptions: request.Options = this.buildRequestOptions(accessToken, path, qs);
        try {
            const response: string = await request(requestOptions);
            const parsedResponse: IResponse<T> = JSON.parse(response);
            return parsedResponse;
        } catch (e) {
            return e;
        }
    }

    /**
     * Build Request options
     *
     * @private
     * @param {string} accessToken
     * @param {string} path
     * @param {object} [qs]
     * @returns {request.Options}
     */
    private buildRequestOptions(accessToken: string, path: string, qs?: object): request.Options {
        const requestOptions: request.Options = {
            uri: path,
            method: "GET",
            headers: {
                Authorization: "Bearer " + accessToken
            }
        };
        if (qs) {
            requestOptions.qs = qs;
        }
        return requestOptions;
    }

    /**
     * Call to /me API.
     *
     * @param accessToken
     * @returns {Promise<IResponse<IMe>>}
     */
    public async getMe(accessToken: string): Promise<IResponse<IMe>> {
        return this.callAPI<IMe>(accessToken, `${C.API_HOST}/data/v1/me`);
    }

    /**
     * Call to /info API.
     *
     * @param {string} accessToken
     * @returns {Promise<IResponse<IInfo>>}
     */
    public async getInfo(accessToken: string): Promise<IResponse<IInfo>> {
        return this.callAPI<IInfo>(accessToken, `${C.API_HOST}/data/v1/info`);
    }

    /**
     * Call to /accounts API.
     *
     * @param accessToken
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async getAccounts(accessToken: string): Promise<IResponse<IAccount>> {
        return this.callAPI<IAccount>(accessToken, `${C.API_HOST}/data/v1/accounts`);
    }

    /**
     * Call to /accounts/account_id API.
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async getAccountInfo(accessToken: string, accountId: string): Promise<IResponse<IAccount>> {
        return this.callAPI<IAccount>(accessToken, `${C.API_HOST}/data/v1/accounts/${accountId}`);
    }

    /**
     * Call to /accounts/account_id/transactions API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<ITransaction>>}
     */
    public async getTransactions(accessToken: string, accountId: string, from: string, to: string): Promise<IResponse<ITransaction>> {
       if (!moment(from, moment.ISO_8601).isValid() || !moment(to, moment.ISO_8601).isValid()) {
           throw Error("Error");
       }

       const qs = {
            from,
            to
        };

       return this.callAPI<ITransaction>(accessToken, `${C.API_HOST}/data/v1/accounts/${accountId}/transactions`, qs);
    }

    /**
     * Call to /accounts/account_id/balance API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IBalance>>}
     */
    public async getBalance(accessToken: string, accountId: string): Promise<IResponse<IBalance>> {
        return this.callAPI<IBalance>(accessToken, `${C.API_HOST}/data/v1/accounts/${accountId}/balance`);
    }
}
