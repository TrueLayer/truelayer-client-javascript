// Interface to support options

export interface IOptions {
    auth_host: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    nonce: string;
    state: string;
    scope: string;
}