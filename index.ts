// Imports
import * as auth from "./src/auth";
import * as data from "./src/dataApi";
import { IOptions } from "./src/IOptions";
import { IClientHelpers } from "./src/IClientHelpers";

export class ApiClient {
    public options: IOptions;

    public auth: auth.IAuth;
    public data: data.IData;

    constructor(options: IOptions) {
        this.options = options;
    }

    // TODO pass all options to the auth and data rather than input params on call
    public v1(): IClientHelpers {
        return {
            auth,
            data
        };
    }
}
