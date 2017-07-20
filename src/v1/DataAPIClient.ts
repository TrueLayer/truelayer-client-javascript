import { ApiError } from "./APIError";
import { Constants } from "./Constants";
import { IAccount } from "./interfaces/data/IAccount";
import { IBalance } from "./interfaces/data/IBalance";
import { IInfo } from "./interfaces/data/IInfo";
import { IJWT } from "./interfaces/auth/IJWT";
import { IMe } from "./interfaces/data/IMe";
import { IResponse } from "./interfaces/data/IResponse";
import { ITransaction } from "./interfaces/data/ITransaction";
import * as decode from "jwt-decode";
import * as moment from "moment";
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

        const isValidToken = DataAPIClient.validateToken(accessToken);
        if (!isValidToken) {
            throw new ApiError(new Error("Invalid access token"));
        }

        const requestOptions = DataAPIClient.buildRequestOptions(accessToken, path, qs);

        try {
            const response = await request.get(requestOptions);
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
     * Date format expected: YYYY-MM-DD
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

    /**
     * Returns a boolean indicating whether the token is valid.
     *
     * @param {string} accessToken
     * @returns {boolean}
     */
    public static validateToken(accessToken: string): boolean {
        let decoded: IJWT;
        try {
            decoded = decode(accessToken);
        } catch (error) {
            return false;
        }
        const expiry = decoded.exp;
        const now = moment().utc().unix();
        return now - expiry < 0;
    }
}
