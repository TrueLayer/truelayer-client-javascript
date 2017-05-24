// Interface to support options

export interface IOptions {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    // add belwo to params of method aurthenticationlink()
    nonce: string;
    state: string;
    scope: string;
}