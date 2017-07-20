import { IError } from "./interfaces/data/IResponse";
import { RequestError, StatusCodeError } from "request-promise/errors";

/**
 * Base class extending native errors
 *
 * @class ApiError
 * @extends {Error}
 */
export class ApiError extends Error {

    public error: string = "internal_error";

    /**
     * Creates an instance of ApiError.
     *
     * @param {Error} error
     */
    constructor(error: Error) {
        // Super call to Error
        super(ApiError.getErrorResponse(error).error_description);
        // Generate error response object
        this.error = ApiError.getErrorResponse(error).error;
    }

    /**
     * Construct error response
     *
     * @param {string} code
     * @param {string} description
     * @returns {IError}
     */
    // tslint:disable-next-line:variable-name
    private static constructErrorResponse(error: string, error_description: string): IError {
        return {
            error,
            error_description
        };
    }

    /**
     * Construct error response based on generic HTTP status code
     *
     * @param httpStatusCode
     * @returns {string}
     */
    private static genericHttpResponse(httpStatusCode: number): IError {
        switch (httpStatusCode) {
            case 400: return ApiError.constructErrorResponse("bad_request", "Bad request");
            case 401: return ApiError.constructErrorResponse("unauthorized", "Unauthorized");
            case 403: return ApiError.constructErrorResponse("forbidden", "Forbidden");
            case 404: return ApiError.constructErrorResponse("not_found", "Not Found");
            default: return ApiError.constructErrorResponse("internal_error", "Internal error");
        }
    }

    /**
     * Construct error response object
     *
     * @param {Error} error
     * @returns {IError}
     */
    private static getErrorResponse(error: Error): IError {
        switch (error.constructor) {
            case StatusCodeError:
                // The server responded with a status codes other than 2xx.
                try {
                    const errorResponse = JSON.parse((error as StatusCodeError).error);
                    return errorResponse.error && errorResponse.error_description
                        ? ApiError.constructErrorResponse(errorResponse.error, errorResponse.error_description)
                        : ApiError.constructErrorResponse(errorResponse, errorResponse);
                } catch (e) {
                    return ApiError.genericHttpResponse((error as StatusCodeError).statusCode);
                }
            case RequestError:
                // The request failed due to technical reasons.
                const reqError = (error as RequestError).error;
                return ApiError.constructErrorResponse(reqError.code, "Error on `" + reqError.syscall + "`");
            default:
                if (error.message === "Invalid access token") {
                    return ApiError.constructErrorResponse("invalid_access_token", "Invalid access token.");
                }
                return ApiError.constructErrorResponse("internal_error", "Well, this is embarrassing!");
        }
    }
}
