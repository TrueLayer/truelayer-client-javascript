// Internal imports
import { TruelayerErrors } from "./errors";
import IResponse from "./interfaces/data/IResponse";
import IOptions from "./interfaces/auth/IOptions";
import Constants from "./constants";
import ITransaction from "./interfaces/data/ITransaction";
import IAccount from "./interfaces/data/IAccount";
import IBalance from "./interfaces/data/IBalance";
import IInfo from "./interfaces/data/IInfo";
import IMe from "./interfaces/data/IMe";

// External imports
import * as request from "request-promise";
import * as moment from "moment";

export default class Data {

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
        return await request.get(requestOptions);
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
     * Wrapper function to deal with try/catch blocks and handle errors
     * @param f - callAPI function to required API p
     * @returns {()=>Promise<IResponse<T>|string|any>}
     */
    private endpointWrapper<T>(f: Promise<IResponse<T>>) {
        return async () => {
            try {
                return await f;
            } catch (error) {
                if (error.statusCode !== 200) {
                    return JSON.stringify(TruelayerErrors.HTTPError.mapHTTPErrorCodes(error));
                } else {
                    return error;
                }
            }
        };
    }

    /**
     * Call to /me API.
     *
     * @param accessToken
     * @returns {Promise<IResponse<IMe>>}
     */
    public async getMe(accessToken: string): Promise<IResponse<IMe>> {
        const details = this.callAPI<IMe>(accessToken, `${Constants.API_HOST}/data/v1/me`);
        return await this.endpointWrapper(details)();
    }

    /**
     * Call to /info API.
     *
     * @param {string} accessToken
     * @returns {Promise<IResponse<IInfo>>}
     */
    public async getInfo(accessToken: string): Promise<IResponse<IInfo>> {
        const info = this.callAPI<IInfo>(accessToken, `${Constants.API_HOST}/data/v1/info`);
        return await this.endpointWrapper(info)();
    }

    /**
     * Call to /accounts API.
     *
     * @param accessToken
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async getAccounts(accessToken: string): Promise<IResponse<IAccount>> {
        const accounts = this.callAPI<IAccount>(accessToken, `${Constants.API_HOST}/data/v1/accounts`);
        return await this.endpointWrapper(accounts)();
    }

    /**
     * Call to /accounts/account_id API.
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IAccount>>}
     */
    public async getAccountInfo(accessToken: string, accountId: string): Promise<IResponse<IAccount>> {
        const accountInfo = this.callAPI<IAccount>(accessToken, `${Constants.API_HOST}/data/v1/accounts/${accountId}`);
        return await this.endpointWrapper(accountInfo)();
    }

    /**
     * Call to /accounts/account_id/transactions API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<ITransaction>>}
     */
    // TODO: this throw should probably be a return
    public async getTransactions(accessToken: string, accountId: string, from: string, to: string): Promise<IResponse<ITransaction>> {
       if (!moment(from, moment.ISO_8601).isValid() || !moment(to, moment.ISO_8601).isValid()) {
           throw new TruelayerErrors.InvalidInputError("Invalid `from` date provided");
       }

       if (!moment(to, moment.ISO_8601).isValid()) {
            throw new TruelayerErrors.InvalidInputError("Invalid `to` date provided");
        }

       const qs = {
            from,
            to
        };

       const transactions = this.callAPI<ITransaction>(accessToken, `${Constants.API_HOST}/data/v1/accounts/${accountId}/transactions`, qs);
       return await this.endpointWrapper(transactions)();
    }

    /**
     * Call to /accounts/account_id/balance API
     *
     * @param accessToken
     * @param accountId
     * @returns {Promise<IResponse<IBalance>>}
     */
    public async getBalance(accessToken: string, accountId: string): Promise<IResponse<IBalance>> {
        const balance = this.callAPI<IBalance>(accessToken, `${Constants.API_HOST}/data/v1/accounts/${accountId}/balance`);
        return await this.endpointWrapper(balance)();
    }
}
