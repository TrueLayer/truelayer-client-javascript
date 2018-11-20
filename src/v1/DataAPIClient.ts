import { ApiError } from "./APIError";
import { Constants } from "./Constants";
import { IAccount } from "./interfaces/data/IAccount";
import { IBalance } from "./interfaces/data/IBalance";
import { IInfo } from "./interfaces/data/IInfo";
import { IJWT } from "./interfaces/auth/IJWT";
import { IMe } from "./interfaces/data/IMe";
import { IResult } from "./interfaces/data/IResponse";
import { ITransaction } from "./interfaces/data/ITransaction";
import * as decode from "jwt-decode";
import * as moment from "moment";
import * as request from "request-promise";

/** Card Interfaces **/

import { ICard } from "./interfaces/data/ICard";
import { ICardBalance } from "./interfaces/data/ICardBalance";
import { ICardTransaction } from "./interfaces/data/ICardTransaction";

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
     * @returns {Promise<IResult<T>>}
     */
    public static async callAPI<T>(accessToken: string, path: string, qs?: object): Promise<IResult<T>> {

        const isValidToken = DataAPIClient.validateToken(accessToken);
        if (!isValidToken) {
            throw new ApiError(new Error("Invalid access token"));
        }

        const requestOptions = DataAPIClient.buildRequestOptions(accessToken, path, qs);

        try {
            const response = await request.get(requestOptions);
            const parsedResponse: IResult<T> = JSON.parse(response);
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
            },
            timeout: Constants.API_TIMEOUT
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
     * @returns {Promise<IResult<IMe>>}
     */
    public static async getMe(accessToken: string) {
         return await DataAPIClient.callAPI<IMe>(accessToken, `${Constants.API_URL}/data/v1/me`);
    }

    /**
     * Call to /info API.
     *
     * @param {string} accessToken
     * @returns {Promise<IResult<IInfo>>}
     */
    public static async getInfo(accessToken: string): Promise<IResult<IInfo>> {
        return await DataAPIClient.callAPI<IInfo>(accessToken, `${Constants.API_URL}/data/v1/info`);
    }

    /**
     * Call to /accounts API.
     *
     * @param accessToken
     * @returns {Promise<IResult<IAccount>>}
     */
    public static async getAccounts(accessToken: string): Promise<IResult<IAccount>> {
        return await DataAPIClient.callAPI<IAccount>(accessToken, `${Constants.API_URL}/data/v1/accounts`);
    }

    /**
     * Call to /accounts/account_id API.
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResult<IAccount>>}
     */
    public static async getAccount(accessToken: string, accountId: string): Promise<IResult<IAccount>> {
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
     * @returns {Promise<IResult<ITransaction>>}
     */
    public static async getTransactions(accessToken: string, accountId: string, from?: string, to?: string): Promise<IResult<ITransaction>> {

        const qs = {
            ...from ? { from: from } : {},
            ...to ? { to: to } : {}
        };

        return await DataAPIClient.callAPI<ITransaction>(accessToken, `${Constants.API_URL}/data/v1/accounts/${accountId}/transactions`, qs);
    }

    /**
     * Call to /accounts/account_id/transactions/pending API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResult<ITransaction>>}
     */
    public static async getPendingTransactions(accessToken: string, accountId: string): Promise<IResult<ITransaction>> {
        return await DataAPIClient.callAPI<ITransaction>(accessToken, `${Constants.API_URL}/data/v1/accounts/${accountId}/transactions/pending`);
    }

    /**
     * Call to /accounts/account_id/balance API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResult<IBalance>>}
     */
    public static async getBalance(accessToken: string, accountId: string): Promise<IResult<IBalance>> {
        return await DataAPIClient.callAPI<IBalance>(accessToken, `${Constants.API_URL}/data/v1/accounts/${accountId}/balance`);
    }

    /**
     * Call to /cards API.
     *
     * @param accessToken
     * @returns {Promise<IResult<ICard>>}
     */
    public static async getCards(accessToken: string): Promise<IResult<ICard>> {
        return await DataAPIClient.callAPI<ICard>(accessToken, `${Constants.API_URL}/data/v1/cards`);
    }

    /**
     * Call to /cards/account_id API.
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResult<ICard>>}
     */
    public static async getCard(accessToken: string, accountId: string): Promise<IResult<ICard>> {
        return await DataAPIClient.callAPI<ICard>(accessToken, `${Constants.API_URL}/data/v1/cards/${accountId}`);
    }

    /**
     * Call to /cards/account_id/transactions API
     * Date format expected: YYYY-MM-DD
     *
     * @param accessToken
     * @param accountId
     * @param from
     * @param to
     * @returns {Promise<IResult<ICardTransaction>>}
     */
    public static async getCardTransactions(accessToken: string, accountId: string, from?: string, to?: string): Promise<IResult<ICardTransaction>> {

        const qs: object = {
            ...from ? { from: from } : {},
            ...to ? { to: to } : {}
        };

        return await DataAPIClient.callAPI<ICardTransaction>(accessToken, `${Constants.API_URL}/data/v1/cards/${accountId}/transactions`, qs);
    }

    /**
     * Call to /cards/account_id/transactions/pending API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResult<ICardTransaction>>}
     */
    public static async getCardPendingTransactions(accessToken: string, accountId: string): Promise<IResult<ICardTransaction>> {
        return await DataAPIClient.callAPI<ICardTransaction>(accessToken, `${Constants.API_URL}/data/v1/cards/${accountId}/transactions/pending`);
    }

    /**
     * Call to /cards/account_id/balance API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResult<ICardBalance>>}
     */
    public static async getCardBalance(accessToken: string, accountId: string): Promise<IResult<ICardBalance>> {
        return await DataAPIClient.callAPI<ICardBalance>(accessToken, `${Constants.API_URL}/data/v1/cards/${accountId}/balance`);
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
