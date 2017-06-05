import { ApiError } from "./errors";
import { IResponse } from "./interfaces/data/IResponse";
import { Constants } from "./constants";
import { ITransaction } from "./interfaces/data/ITransaction";
import { IAccount } from "./interfaces/data/IAccount";
import { IBalance } from "./interfaces/data/IBalance";
import { IInfo } from "./interfaces/data/IInfo";
import { IMe } from "./interfaces/data/IMe";
import * as request from "request-promise";
import * as moment from "moment";

export class Data {

    /**
     * Generic API calling function
     *
     * @template T
     * @param {string} accessToken
     * @param {string} path
     * @param {object} [qs]
     * @returns {Promise<IResponse<T>>}
     */
    public async callAPI<T>(accessToken: string, path: string, qs?: object): Promise<IResponse<T>> {
        const requestOptions: request.Options = this.buildRequestOptions(accessToken, path, qs);
        try {
            const response: string = await request.get(requestOptions);
            const parsedResponse: IResponse<T> = JSON.parse(response);
            return parsedResponse;
        } catch (error) {
            throw new ApiError(error);
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
    public buildRequestOptions(accessToken: string, path: string, qs?: object): request.Options {
        const requestOptions: request.Options = {
            uri: path,
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
    public async getMe(accessToken: string) {
         return await this.callAPI<IMe>(accessToken, `${Constants.API_HOST}/data/v1/me`);
    }

    /**
     * Call to /info API.
     *
     * @param {string} accessToken
     * @returns {Promise<IResponse<IInfo>>}
     */
    public async getInfo(accessToken: string): Promise<IResponse<IInfo>> {
        return await this.callAPI<IInfo>(accessToken, `${Constants.API_HOST}/data/v1/info`);
    }

    /**
     * Call to /accounts API.
     *
     * @param accessToken
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async getAccounts(accessToken: string): Promise<IResponse<IAccount>> {
        return await this.callAPI<IAccount>(accessToken, `${Constants.API_HOST}/data/v1/accounts`);
    }

    /**
     * Call to /accounts/account_id API.
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async getAccount(accessToken: string, accountId: string): Promise<IResponse<IAccount>> {
        return await this.callAPI<IAccount>(accessToken, `${Constants.API_HOST}/data/v1/accounts/${accountId}`);
    }

    /**
     * Call to /accounts/account_id/transactions API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<ITransaction>>}
     */
    public async getTransactions(accessToken: string, accountId: string, from: string, to: string): Promise<IResponse<ITransaction>> {
       const qs = {
            from,
            to
        };

       return await this.callAPI<ITransaction>(accessToken, `${Constants.API_HOST}/data/v1/accounts/${accountId}/transactions`, qs);
    }

    /**
     * Call to /accounts/account_id/balance API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IBalance>>}
     */
    public async getBalance(accessToken: string, accountId: string): Promise<IResponse<IBalance>> {
        return await this.callAPI<IBalance>(accessToken, `${Constants.API_HOST}/data/v1/accounts/${accountId}/balance`);
    }
}
