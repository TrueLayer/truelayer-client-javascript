import { RequestError, StatusCodeError } from "request-promise/errors";
/**
 * Error class for handling errors
 */
export class ApiError extends Error {

    /**
     * Construct the error
     * @param code
     * @param message
     * @returns {string}
     */
    private static constructErrorMessage(code: string, message: string) {
        return {
            code,
            message
        };
    }

    /**
     * Construct new ApiErrors for generic HTTP error statuses not handled by the APIs
     * @param httpStatusCode
     * @returns {string}
     */
    private static genericHTTPResponse(httpStatusCode: number) {
        switch (httpStatusCode) {
            case 400:
                return ApiError.constructErrorMessage("bad_request", "Bad request");
            case 401:
                return ApiError.constructErrorMessage("unauthorized", "Unauthorized");
            case 403:
                return ApiError.constructErrorMessage("forbidden", "Forbidden");
            case 404:
                return ApiError.constructErrorMessage("not_found", "Not Found");
            default:
                return ApiError.constructErrorMessage("internal_server_error", "Internal server error");
        }
    }

    /**
     * Handle the different types of errors
     *  eg. StatusCodeErrors (server errors) and RequestErrors (network errors)
     * @param error
     * @returns {string}
     */
    private static getMessage(error: Error) {
        // check if the response is not a success
        if (error instanceof StatusCodeError) {

            // check if we have an error body
            if (error.error) {
                try {
                    const parsedError = JSON.parse(error.error);

                    // check if we have error code and error message properties
                    if (!!parsedError.error.code && !!parsedError.error.message) {
                        return ApiError.constructErrorMessage(parsedError.error.code, parsedError.error.message);
                    } else {
                        // this is an auth error because it only contains error.error which is a string
                        return ApiError.constructErrorMessage(parsedError.error, parsedError.error);
                    }
                } catch (e) {
                    // error body is not valid. throw a generic error
                    return ApiError.constructErrorMessage("internal_error", "Internal server error");
                }
                // this is a generic HTTP error
            } else {
                return ApiError.genericHTTPResponse(error.statusCode);
            }

            // handle network errors
        } else if (error instanceof RequestError) {
            return ApiError.constructErrorMessage(error.error.code, "Error on `" + error.error.syscall + "`");
            // handle any other error
        } else {
            return ApiError.constructErrorMessage("internal_error", "Internal server error");
        }
    }

    public readonly code: string = "internal_error";
    constructor(error: Error) {
        super(ApiError.getMessage(error).message);
        this.code = ApiError.getMessage(error).code;
    }
}
