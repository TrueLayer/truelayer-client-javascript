import * as request from "request-promise";
import IOptions from "./IOptions";
import C from "./constants"

interface IResponse<T> {
    success: boolean;
    error?: IError;
    results?: T;
}

interface IError {
    code: string;
    message?: string;
}

interface IInfo {
    full_name: string;
    update_timestamp?: string;
    date_of_birth?: string;
    addresses?: [IAddressInfo];
    emails?: [string];
    phones?: [string];
}

interface IAddressInfo {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

interface IAccount {
    update_timestamp: string;
    account_id: string;
    account_type: string;
    display_name?: string;
    description: string;
    currency: string;
    account_number: IAccountNumber;
}

interface IAccountNumber {
    iban: string;
    swift_bic: string;
    number: string;
    sort_code: string;
}

interface IMe {
    provider_id: string;
    credentials_id: string;
    client_id: string;
}

interface ITransaction {
    timestamp: string;
    description: string;
    transaction_type: string;
    amount: number;
    currency: string;
    balance: IBalance;
    meta: object;
}

interface IBalance {
    currency: string;
    available: number;
    current: number;
    update_timestamp: string;
}

export default class Data {

    // Private
    private readonly options: IOptions;

    // Constructor
    constructor(options: IOptions) {
        this.options = options;
    }


    public async info(access_token: string): Promise<IResponse<IInfo>> {
        const requestOptions: request.Options = {
            uri: `https://${C.AUTH_HOST}/data/v1/info`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        };

        const response: string = await request(requestOptions);
        const parsedResponse: IResponse<IInfo> = JSON.parse(response);
        return parsedResponse;
    };

}