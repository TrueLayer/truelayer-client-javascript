import IAuthOptions from "./src/v1/interfaces/auth/IOptions";
import Data from "./src/v1/data";
import Auth from "./src/v1/auth";
export { default as IResponse } from "./src/v1/interfaces/data/IResponse";
export { default as IOptions } from "./src/v1/interfaces/auth/IOptions";
export { default as IToken } from "./src/v1/interfaces/auth/IToken";
export { default as ITransaction } from "./src/v1/interfaces/data/ITransaction";
export { default as IAccount } from "./src/v1/interfaces/data/IAccount";
export { default as IBalance } from "./src/v1/interfaces/data/IBalance";
export { default as IInfo } from "./src/v1/interfaces/data/IInfo";
export { default as IMe } from "./src/v1/interfaces/data/IMe";

export namespace V1 {
    export interface IOptions extends IAuthOptions {
      client_id: string;
      client_secret: string;
    }

    /**
     * TrueLayer Client
     * Contains methods for the authentication mechanism via `auth` and calls to Data APIs via `data`
     */
    export class Client {

        /**
         * Authentication feautures
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
        constructor(options: IAuthOptions) {
            this.auth = new Auth(options);
            this.data = new Data();
        }
    }
}
