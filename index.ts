// Imports
import IOptions from "./src/v1/interfaces/auth/IOptions";
import Data from "./src/v1/data";
import Auth from "./src/v1/auth";

// Module exports
export { default as IResponse } from "./src/v1/interfaces/data/IResponse";
export { default as IOptions } from "./src/v1/interfaces/auth/IOptions";
export { default as ITokens } from "./src/v1/interfaces/auth/ITokens";

// Endpoint interface exports
export { default as ITransaction } from "./src/v1/interfaces/data/ITransaction";
export { default as IAccount } from "./src/v1/interfaces/data/IAccount";
export { default as IBalance } from "./src/v1/interfaces/data/IBalance";
export { default as IInfo } from "./src/v1/interfaces/data/IInfo";
export { default as IMe } from "./src/v1/interfaces/data/IMe";

export namespace V1 {
    export class ApiClient {

        // Pulbic
        public auth: Auth;
        public data: Data;

        // Constructor
        constructor(options: IOptions) {
            this.auth = new Auth(options);
            this.data = new Data();
        }
    }
}
