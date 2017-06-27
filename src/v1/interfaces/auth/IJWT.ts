/**
 * Structure of JWT (JSON Web Token)
 * Docs: https://jwt.io/
 *
 * @interface IJWT
 */
export interface IJWT {
    amr: [ string ];
    aud: [ string, string ];
    auth_time: number;
    client_id: string;
    connector_id: string;
    credentials_key: string;
    exp: number;
    idp: string;
    iss: string;
    nbf: number;
    scope: Scope[];
    sub: string;
}

/**
 * List of possible values for `scope` for the authentication URL
 *
 * @type: Scope
 */
export type Scope = "info" | "accounts" | "transactions" | "balance" | "offline_access";
