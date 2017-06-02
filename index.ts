import Data from "./src/v1/data";
import Auth from "./src/v1/auth";
import IOptions from "./src/v1/interfaces/auth/IOptions";
export { default as IResponse } from "./src/v1/interfaces/data/IResponse";
export { default as IOptions } from "./src/v1/interfaces/auth/IOptions";
export { default as IToken } from "./src/v1/interfaces/auth/IToken";
export { default as ITransaction } from "./src/v1/interfaces/data/ITransaction";
export { default as IAccount } from "./src/v1/interfaces/data/IAccount";
export { default as IBalance } from "./src/v1/interfaces/data/IBalance";
export { default as IInfo } from "./src/v1/interfaces/data/IInfo";
export { default as IMe } from "./src/v1/interfaces/data/IMe";

/**
 * TrueLayer Client
 * Contains methods for the authentication mechanism via `auth` and calls to Data APIs via `data`
 */
export namespace V1 {

    export class Client {

        /**
         * Authentication features
         * @type {Auth}
         */
        public auth: Auth;
        /**
         * Data API access features
         * @type {Data}
         */
        public data: Data;

        /**
         * Creates an instance of ApiClient.
         * @param {IOptions} options
         */
        constructor(options: IOptions) {
            this.auth = new Auth(options);
            this.data = new Data();
        }
    }
}
