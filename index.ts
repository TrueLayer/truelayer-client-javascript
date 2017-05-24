// Imports
import IOptions from "./src/IOptions";
import Data from "./src/data";
import Auth from "./src/auth";

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
