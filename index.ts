// Imports
import { IAuth } from "./src/auth";
import { IData } from "./src/dataApi";
import { IOptions } from "./src/IOptions";

export class ApiClient {
    public options: IOptions;

    public auth: IAuth;
    public data: IData;

    constructor(options: IOptions) {
        this.options = options;
    }

    public v1(): object {
        return {
            auth: this.auth,
            data: this.data
        };
    }
}
