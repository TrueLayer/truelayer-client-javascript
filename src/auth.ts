import {IOptions} from "./IOptions";
import * as request from "request-promise";

export interface IAuth {
    getAuthUrl(options: IOptions): string;
    exchangeCodeForToken(code: string, options: IOptions): Promise<IAccessTokens>;
    refreshAccessToken(refreshToken: string, options: IOptions): Promise<IAccessTokens>;
}

export interface IAccessTokens {
    access_token: string;
    refresh_token: string;
}

// TODO pass enable_mock optionally
// TODO pass options to class rather than individual methods
export const getAuthUrl = (options: IOptions): string => {
    return `https://${options.auth_host}/?response_type=code&response_mode=form_post&client_id=${options.client_id}&redirect_uri=${options.redirect_uri}&scope=${options.scope}&nonce=${options.nonce}&state=${options.state}&enable_mock=true`;
};

export async function exchangeCodeForToken(code: string, options: IOptions): Promise<IAccessTokens> {
    const requestOptions: request.Options = {
        uri: `https://${options.auth_host}/connect/token`,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
            grant_type: "authorization_code",
            client_id: options.client_id,
            client_secret: options.client_secret,
            redirect_uri: options.redirect_uri,
            code
        }
    };

    const response: string = await request(requestOptions);
    const parsedResponse: any = JSON.parse(response);
    return {
        access_token: parsedResponse.access_token,
        refresh_token: parsedResponse.refresh_token
    };
};

export async function refreshAccessToken(refreshToken: string, options: IOptions): Promise<IAccessTokens> {
    const requestOptions: request.Options = {
        uri: `https://${options.auth_host}/connect/token`,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
            grant_type: "refresh_token",
            client_id: options.client_id,
            client_secret: options.client_secret,
            refresh_token: refreshToken
        }
    };

    const response: string = await request(requestOptions);
    const parsedResponse: any = JSON.parse(response);
    return {
      access_token: parsedResponse.access_token,
      refresh_token: parsedResponse.refresh_token
    };
};