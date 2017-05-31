import { StatusCodeError } from "request-promise/errors";

interface ITrueLayerError {
    success: boolean;
    code: number;
    message: string;
}

export namespace TruelayerErrors {

    /**
     * Error class for invalid input errors
     */
    export class InvalidInputError extends Error {
        constructor(message: string) {
            super(message);
            Object.setPrototypeOf(this, HTTPError.prototype);
        }
    }

    /**
     * Error class for mapping expected HTTP errors
     */
    export class HTTPError extends Error {

        // TODO: differentiate between the two types of 403
        private static httpErrors = [
            {
                success: false,
                code: 400,
                message: "The supplied parameters are not valid."
            },
            {
                success: false,
                code: 401,
                message: "The credentials entered are incorrect."
            },
            {
                success: false,
                code: 403,
                message: "The account is temporarily locked by the provider."
            },
            {
                success: false,
                code: 404,
                message: "The requested account cannot  be found."
            },{
                success: false,
                code: 500,
                message: "Internal server error."
            },
        ];

        constructor(message: string) {
            super(message);
            Object.setPrototypeOf(this, HTTPError.prototype);
        }

        /**
         * Function to map from expected HTTP codes to known error messages
         * @param error
         * @returns {ITrueLayerError}
         */
        public static mapHTTPErrorCodes(error: StatusCodeError): ITrueLayerError {
            const errorCode = error.statusCode;
            const mapError = this.httpErrors.find((err) => {
                return err.code === errorCode;
            });
            if (mapError) {
                return mapError;
            } else {
                return {
                    success: false,
                    code: 520,
                    message: "Unknown error."
                };
            }
        }
    }
}
