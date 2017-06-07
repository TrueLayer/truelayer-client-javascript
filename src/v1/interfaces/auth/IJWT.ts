/**
 * Format of JWT token
 */
export interface IJWT {
    nbf: number;
    exp: number;
    iss: string;
    aud: [ string, string ];
    client_id: string;
    sub: string;
    auth_time: number;
    idp: string;
    connector_id: string;
    credentials_key: string;
    scope: Scope[];
    amr: [ string ];
}

/**
 * @type: Scope
 * List of possible values for `scope` for the authentication URL
 */
export type Scope = "info" | "accounts" | "transactions" | "balance" | "offline_access";
