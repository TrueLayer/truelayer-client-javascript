import { Data } from "./src/v1/data";
import { Auth } from "./src/v1/auth";
import { IOptions } from "./src/v1/interfaces/auth/IOptions";
export { IResponse } from "./src/v1/interfaces/data/IResponse";
export { IOptions } from "./src/v1/interfaces/auth/IOptions";
export { IToken } from "./src/v1/interfaces/auth/IToken";
export { ITransaction } from "./src/v1/interfaces/data/ITransaction";
export { IAccount } from "./src/v1/interfaces/data/IAccount";
export { IBalance } from "./src/v1/interfaces/data/IBalance";
export { IInfo } from "./src/v1/interfaces/data/IInfo";
export { IMe } from "./src/v1/interfaces/data/IMe";

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
