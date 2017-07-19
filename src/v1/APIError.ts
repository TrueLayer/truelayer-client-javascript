import { IError } from "./interfaces/data/IResponse";
import { RequestError, StatusCodeError } from "request-promise/errors";

/**
 * Parent error class extending native errors
 * @class ApiError
 * @extends {Error}
 */
abstract class ApiError extends Error {

    public error: string = "internal_error";

    /**
     * Construct error response
     * @param {string} code
     * @param {string} description
     * @returns {IError}
     */
    protected static constructErrorResponse(code: string, description: string): IError {
        return {
            error: code,
            error_description: description
        };
    }
}

/**
 * Derived error class to handle data api specific exceptions
 * @class DataApiError
 * @extends {ApiError}
 */
export class DataApiError extends ApiError {

    /**
     * Creates an instance of ApiError.
     * @param {Error} error
     */
    constructor(error: Error) {
        // Super call to Error
        super(DataApiError.getErrorResponse(error).error_description);
        // Generate error response object
        this.error = DataApiError.getErrorResponse(error).error;
    }

    /**
     * Construct data api error response given a http status code.
     * @param httpStatusCode
     * @returns {string}
     */
    private static getResponseFromStatusCode(httpStatusCode: number): IError {
        switch (httpStatusCode) {
            case 400: return DataApiError.constructErrorResponse("validation_error", "The supplied parameters are not valid.");
            case 401: return DataApiError.constructErrorResponse("wrong_credentials", "The credentials entered are incorrect.");
            case 403: return DataApiError.constructErrorResponse("account_locked", "The account is temporarily locked by the provider.");
            case 404: return DataApiError.constructErrorResponse("account_not_found", "The requested account cannot be found.");
            case 410: return DataApiError.constructErrorResponse("wrong_bank", "The selected provider recognizes the user within a different context.");
            case 500: return DataApiError.constructErrorResponse("internal_server_error", "Internal server error.");
            case 503: return DataApiError.constructErrorResponse("under_maintenance", "The current provider is unavailable.");
            default: return DataApiError.constructErrorResponse("internal_error", "Well, this is embarrassing!");
        }
    }

    /**
     * Construct error response object
     * @param {Error} error
     * @returns {IError}
     */
    private static getErrorResponse(error: Error): IError {
        switch (error.constructor) {
            case StatusCodeError:
                // The server responded with a status codes other than 2xx.
                return DataApiError.getResponseFromStatusCode((error as StatusCodeError).statusCode);
            case RequestError:
                // The request failed due to technical reasons.
                const reqError = (error as RequestError).error;
                return DataApiError.constructErrorResponse(reqError.code, "Error on `" + reqError.syscall + "`");
            default:
                if (error.message === "Invalid access token") {
                    return DataApiError.constructErrorResponse("invalid_access_token", "Invalid access token.");
                }
                return DataApiError.constructErrorResponse("internal_error", "Well, this is embarrassing!");
        }
    }
}

/**
 * Derived error class to handle auth server specific exceptions
 * @class DataApiError
 * @extends {ApiError}
 */
export class AuthApiError extends ApiError {

    /**
     * Creates an instance of ApiError.
     * @param {Error} error
     */
    constructor(error: Error) {
        // Super call to Error
        super(AuthApiError.getErrorResponse(error).error_description);
        // Generate error response object
        this.error = AuthApiError.getErrorResponse(error).error;
    }

    /**
     * Returns auth error message given an error code.
     * @param {string} errorCode
     * @returns {string}
     */
    private getMessageFromErrorCode(errorCode: string): string {
        switch (errorCode) {
            case "invalid_request": return "The request is missing a required parameter.";
            case "unauthorized_client": return "The client is not authorized to request an authorization token.";
            case "invalid_client": return "Client authentication failed.";
            case "access_denied": return "The resource owner or authorization server denied the request.";
            case "unsupported_response_type": return "The authorization server does not support obtaining an authorization code using this method.";
            case "invalid_scope": return "The requested scope is invalid, unknown, or malformed.";
            case "server_error": return "The server encountered an unexpected condition that prevented it from fulfilling the request.";
            case "temporarily_unavailable": return "The authorization server is currently unable to handle the request due to a temporary overloading or maintenance.";
            case "invalid_grant": return "The provided authorization grant or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.";
            case "unsupported_grant_type": return "The authorization grant type is not supported by the authorization server.";
            default: return "Unknown authorization error.";
        }
    }

    /**
     * Construct error response object
     * @param {Error} error
     * @returns {IError}
     */
    private static getErrorResponse(error: Error): IError {
        switch (error.constructor) {
            case StatusCodeError:
                // The server responded with a status codes other than 2xx.
                try {
                    const parsedError = JSON.parse((error as StatusCodeError).error);
                    return AuthApiError.constructErrorResponse(parsedError.error, parsedError.error);
                } catch (e) {
                    return AuthApiError.constructErrorResponse("server_error", "The server encountered an unexpected condition that prevented it from fulfilling the request");
                }
            case RequestError:
                // The request failed due to technical reasons.
                const reqError = (error as RequestError).error;
                return AuthApiError.constructErrorResponse(reqError.code, "Error on `" + reqError.syscall + "`");
            default:
                return AuthApiError.constructErrorResponse("server_error", "The server encountered an unexpected condition that prevented it from fulfilling the request");
        }
    }
}
