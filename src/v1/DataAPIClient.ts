import { ApiError } from "./APIError";
import { IResponse } from "./interfaces/data/IResponse";
import { Constants } from "./Constants";
import { ITransaction } from "./interfaces/data/ITransaction";
import { IAccount } from "./interfaces/data/IAccount";
import { IBalance } from "./interfaces/data/IBalance";
import { IInfo } from "./interfaces/data/IInfo";
import { IMe } from "./interfaces/data/IMe";
import * as request from "request-promise";

/**
 * Class responsible for calling to the Data endpoints
 */
export class DataAPIClient {

    /**
     * Generic API calling function
     *
     * @template T
     * @param {string} accessToken
     * @param {string} path
     * @param {object} [qs]
     * @returns {Promise<IResponse<T>>}
     */
    public static async callAPI<T>(accessToken: string, path: string, qs?: object): Promise<IResponse<T>> {
        const requestOptions: request.Options = DataAPIClient.buildRequestOptions(accessToken, path, qs);
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
    public static buildRequestOptions(accessToken: string, path: string, qs?: object): request.Options {
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
    public static async getMe(accessToken: string) {
         return await DataAPIClient.callAPI<IMe>(accessToken, `${Constants.API_URL}/data/v1/me`);
    }

    /**
     * Call to /info API.
     *
     * @param {string} accessToken
     * @returns {Promise<IResponse<IInfo>>}
     */
    public static async getInfo(accessToken: string): Promise<IResponse<IInfo>> {
        return await DataAPIClient.callAPI<IInfo>(accessToken, `${Constants.API_URL}/data/v1/info`);
    }

    /**
     * Call to /accounts API.
     *
     * @param accessToken
     * @returns {Promise<IResponse<IAccount>>}
     */
    public static async getAccounts(accessToken: string): Promise<IResponse<IAccount>> {
        return await DataAPIClient.callAPI<IAccount>(accessToken, `${Constants.API_URL}/data/v1/accounts`);
    }

    /**
     * Call to /accounts/account_id API.
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IAccount>>}
     */
    public static async getAccount(accessToken: string, accountId: string): Promise<IResponse<IAccount>> {
        return await DataAPIClient.callAPI<IAccount>(accessToken, `${Constants.API_URL}/data/v1/accounts/${accountId}`);
    }

    /**
     * Call to /accounts/account_id/transactions API
     *
     * @param accessToken
     * @param accountId
     * @param from
     * @param to
     * @returns {Promise<IResponse<ITransaction>>}
     */
    public static async getTransactions(accessToken: string, accountId: string, from: string, to: string): Promise<IResponse<ITransaction>> {
       const qs = {
            from,
            to
        };

       return await DataAPIClient.callAPI<ITransaction>(accessToken, `${Constants.API_URL}/data/v1/accounts/${accountId}/transactions`, qs);
    }

    /**
     * Call to /accounts/account_id/balance API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IBalance>>}
     */
    public static async getBalance(accessToken: string, accountId: string): Promise<IResponse<IBalance>> {
        return await DataAPIClient.callAPI<IBalance>(accessToken, `${Constants.API_URL}/data/v1/accounts/${accountId}/balance`);
    }
}
