// Imports
import IOptions from "./src/interfaces/IOptions";
import Data from "./src/data";
import Auth from "./src/auth";

// Module exports
export { default as IOptions } from "./src/interfaces/IOptions";
export { default as ITokens } from "./src/interfaces/ITokens";
export { default as IResponse } from "./src/interfaces/IResponse";

// Endpoint interface exports
export { default as IAccount } from "./src/model/account";
export { default as IBalance } from "./src/model/balance";
export { default as IInfo } from "./src/model/info";
export { default as IMe } from "./src/model/me";
export { default as ITransaction } from "./src/model/transaction";

export namespace V1 {
    export class ApiClient {

        // Private
        private options: IOptions;
        // Pulbic
        public auth: Auth;
        public data: Data;

        // Constructor
        constructor(options: IOptions) {
            this.options = options;
            this.auth = new Auth(this.options);
            this.data = new Data(this.options);
        }
    }
}
