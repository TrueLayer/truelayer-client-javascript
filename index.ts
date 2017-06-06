import { DataAPIClient } from "./src/v1/DataAPIClient";
import { AuthAPIClient } from "./src/v1/AuthAPIClient";
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
 * Contains methods for the authentication mechanism via `auth` and calls to DataAPIClient APIs via `data`
 */
export namespace V1 {

    export class Client {

        /**
         * Authentication features
         * @type {AuthAPIClient}
         */
        public auth: AuthAPIClient;
        /**
         * DataAPIClient API access features
         * @type {DataAPIClient}
         */
        public data: DataAPIClient;

        /**
         * Creates an instance of ApiClient.
         * @param {IOptions} options
         */
        constructor(options: IOptions) {
            this.auth = new AuthAPIClient(options);
            this.data = new DataAPIClient();
        }
    }
}
