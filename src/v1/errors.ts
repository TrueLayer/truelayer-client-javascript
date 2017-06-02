import { StatusCodeError } from "request-promise/errors";

interface ITrueLayerError {
    name: string;
    message: string;
}

export namespace TruelayerErrors {

    /**
     * Error class for mapping expected HTTP errors
     */
    export class DataError extends Error {

        constructor() {
            super();
        }

        public static transformApiError(error: StatusCodeError): ITrueLayerError {
            const parsedError = JSON.parse(error.error);
            return {
                name: parsedError.error.code,
                message: parsedError.error.message
            };
        }
    }

    export class InvalidInputError extends Error {
        constructor(message: string) {
            super(message);
        }
    }
}
