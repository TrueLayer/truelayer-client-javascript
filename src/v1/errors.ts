import { RequestError, StatusCodeError } from "request-promise/errors";
/**
 * Error class for mapping expected HTTP errors
 */
export class ApiError extends Error {

    /**
     * Construct stringified version of the error
     * @param name
     * @param message
     * @returns {string}
     */
    private static constructErrorMessage(name: string, message: string): string {
        return JSON.stringify({
            name,
            message
        });
    }

    /**
     * Construct new ApiErrors for generic HTTP error statuses not handled by the APIs
     * @param httpStatusCode
     * @returns {string}
     */
    private static genericHTTPresponse(httpStatusCode: number): string {
        switch (httpStatusCode)
        {
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
    private static getMessage(error: Error): string {
        console.log("error " + error);

        // handle server errors
        if (error instanceof StatusCodeError) {

            // this is an error produced by the API
            if (error.error) {
                try {
                    const parsedError = JSON.parse(error.error);

                    // this is a Data API error because it has error code and error message properties
                    if (!!parsedError.error.code && !!parsedError.error.message) {
                        return ApiError.constructErrorMessage(parsedError.error.code, parsedError.error.message);
                    } else {
                        // this is an auth error because it only contains error.error which is a string
                        // TODO decide what the message is
                        return ApiError.constructErrorMessage(parsedError.error, parsedError.error);
                    }
                } catch (e) {
                    return ApiError.constructErrorMessage("unknown_error", "Unexpected error occurred");
                }
            // this is a generic HTTP error
            } else {
                return ApiError.genericHTTPresponse(error.statusCode);
            }

        // handle network errors
        } else if (error instanceof RequestError) {
            return ApiError.constructErrorMessage(error.error.code, "Error on `" + error.error.syscall + "`");
        // handle surprise errors
        } else {
            return ApiError.constructErrorMessage("unknown_error", "Unexpected error occurred");
        }
    }

    constructor(error: Error) {
        super(ApiError.getMessage(error));
    }
}
