import IOptions from "./IOptions";
import C from "./constants"

interface IResponse {
    success: boolean,
    error?: IError,
    results?: [IInfo]
}

interface IError {
    code: string,
    message: string
}

interface IInfo {
    update_timestamp: string,
    full_name: string,
    date_of_birth: string,
    addresses: [IAddressInfo],
    emails: [string],
    phones: [string]
}

interface IAddressInfo {
    address: string,
    city: string,
    state: string,
    zip: string,
    country: string
}

export default class Data {

    // Private
    private readonly auth_host: string = C.AUTH_HOST;
    private readonly options: IOptions;

    // Constructor
    constructor(options: IOptions) {
        this.options = options;
    }

    // TODO: Add data api functions

}