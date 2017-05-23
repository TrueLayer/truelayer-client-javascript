// Imports
import { getAuthUrl, exchangeCodeForToken } from "./src/auth";
import * as data from "./src/dataApi";

// Interface to support options
export interface IOptions {
    auth_host: string,
    client_id: string,
    client_secret: string,
    redirect_uri: string,
    nonce: string,
    state: string,
    scope: string
}

export interface ApiClient {
    v1(options: IOptions): {
        auth: auth,
        data: data
    }
}

// const client: new Truelayer.ApiClient.v1(options);