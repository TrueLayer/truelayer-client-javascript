interface IJWT {
    nbf: number;
    exp: number;
    iss: string;
    aud: [ string, string ];
    client_id: [ string, string ];
    sub: string;
    auth_time: number;
    idp: string;
    connector_id: string;
    credentials_key: string;
    scope: [ "info" | "accounts" | "transactions" | "balance" | "offline_access" ];
    amr: [ string ];
}

export default IJWT;
