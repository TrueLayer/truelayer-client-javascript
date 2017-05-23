import { IOptions } from "./IOptions";

export interface IAuth {
    getAuthUrl(options: IOptions): string;
    exchangeCodeForToken(code: string): string;
}

export const getAuthUrl = (options: IOptions): string => {
        return "";
    };

export const exchangeCodeForToken = (code: string): string => {
        return "";
    };
