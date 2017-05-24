import { IOptions } from "./IOptions";

export default class Data {

    // Private
    private readonly auth_host: string = "auth.truelayer.com";
    private readonly options: IOptions;

    // Constructor
    constructor(options: IOptions) {
        this.options = options;
    }

    // TODO: Add data api functions
}