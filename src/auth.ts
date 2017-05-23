import { IOptions } from "./IOptions";

export interface IAuth {
    getAuthUrl(options: IOptions): string;
    exchangeCodeForToken(code: string): string;
}

// TODO pass enable_mock optionally
export const getAuthUrl = (options: IOptions): string => {
        return `https://${options.auth_host}/?response_type=code&response_mode=form_post&client_id=${options.client_id}&redirect_uri=${options.redirect_uri}&scope=${options.scope}&nonce=${options.nonce}&state=${options.state}&enable_mock=true`;
    };

export const exchangeCodeForToken = (code: string): string => {
        return "";
    };
