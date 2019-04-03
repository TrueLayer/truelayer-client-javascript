import { ApiError } from "./APIError";
import { Constants } from "./Constants";
import { IResult } from "./interfaces/data/IResponse";
import * as request from "request-promise";

import { IStatusInfo } from "./interfaces/status/IStatusInfo";
import moment = require("moment");

/**
 * Class responsible for calling to the Data endpoints
 */
export class StatusAPIClient {
    /**
     * Generic API calling function
     *
     * @template T
     * @param {string} accessToken
     * @param {string} path
     * @param {object} [qs]
     * @returns {Promise<IResult<T>>}
     */
    public static async callAPI<T>(
        path: string,
        qs?: object
    ): Promise<IResult<T>> {
        const requestOptions = StatusAPIClient.buildRequestOptions(path, qs);
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
    public static buildRequestOptions(
        path: string,
        qs?: object
    ): request.Options {
        const requestOptions: request.Options = {
            uri: path,
            timeout: Constants.API_TIMEOUT
        };

        if (qs) {
            requestOptions.qs = qs;
        }

        return requestOptions;
    }

    /**
     * Call to /data/status API.
     *
     * @returns {Promise<IResult<IStatusInfo>>}
     */
    public static async getStatus(
        from?: Date,
        to?: Date,
        providers?: string[],
        endpoints?: string[]
    ) {
        const dateFormat = "YYYY-MM-DD HH:MM:SS";
        const url = `${Constants.STATUS_URL}/api/v1/data/status`;
        const qs = {
            from: moment(from).format(dateFormat),
            to: moment(to).format(dateFormat),
            providers,
            endpoints
        };
        return await StatusAPIClient.callAPI<IStatusInfo>(url, qs);
    }
}
