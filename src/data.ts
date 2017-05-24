import IOptions from "./IOptions";
import C from "./constants"

interface IAPIResponse {
    success: boolean,
    error?: IAPIError,
    results?: [Info]
}

interface IAPIError {
    code: string,
    message: string
}

interface Info {
    update_timestamp: string,
    full_name: string,
    date_of_birth: string,
    addresses: [AddressInfo],
    emails: [string],
    phones: [string]
}

interface AddressInfo {
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