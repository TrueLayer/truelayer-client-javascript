import { StatusCodeError } from "request-promise/errors";

interface ITrueLayerError {
    name: string;
    message: string;
}

/**
 * Error class for mapping expected HTTP errors
 */
export class ApiError extends Error {
    private static getMessage(state: any): string {
        return "foo";
    }
    constructor(state: any) {
        super(ApiError.getMessage(state));
        // try {
        //     const parsedError = JSON.parse(error.error);
        //     this.name = parsedError.error.code;
        //     this.message = parsedError.error.message;
        // } catch (e) {
        //     return Error("");
        // }
    }

    // public static transformApiError(error: StatusCodeError): ITrueLayerError {
    // }
}

export class InvalidInputError extends Error {
    constructor(message: string) {
        super(message);
    }
}
