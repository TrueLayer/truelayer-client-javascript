import { IAuthResponse } from "./interfaces/auth/IAuthResponse";
import { IOptions } from "./interfaces/auth/IOptions";
import { IToken } from "./interfaces/auth/IToken";
import { IJWT } from "./interfaces/auth/IJWT";
import { Constants } from "./Constants";
import * as request from "request-promise";
import * as decode from "jwt-decode";
import { ApiError } from "./APIError";

export class AuthAPIClient {

    // Private
    private readonly options: IOptions;

    // Constructor
    constructor(options: IOptions) {
        this.options = options;
    }

    /**
     * Builds a correctly formatted authentication url
     *
     * @param {string} redirectURI
     * @param {string[]} scope
     * @param {string} nonce
     * @param {string} [state]
     * @param {boolean} [enableMock]
     * @returns {string}
     */
    public getAuthUrl(redirectURI: string, scope: string[], nonce: string, state?: string, enableMock?: boolean): string {
        const concatScope: string = scope.join(" ");
        let authUrl: string = `https://${Constants.AUTH_HOST}/?` +
            `response_type=code&` +
            `response_mode=form_post&` +
            `client_id=${this.options.client_id}&` +
            `redirect_uri=${redirectURI}&` +
            `scope=${concatScope}&` +
            `nonce=${nonce}`;

        // TODO: check if we need to URL encode this
        if (!!state) {
            authUrl += `&state=${state}`;
        }
        if (enableMock) {
            authUrl += `&enable_mock=true`;
        }
        return authUrl;
    }

    /**
     * Validates that a given string is a correct scope literal
     *
     * @private
     * @param {string} grant
     * @returns {boolean}
     */
    // TODO: check if this is used or remove
    private static isValidScope(grant: string): boolean {
        switch (grant) {
            case "offline_access":
            case "info":
            case "accounts":
            case "transactions":
            case "balance": {
                return true;
            }
            default: {
                return false;
            }
        }
    }

    /**
     * Exchanges an auth code for an access token
     *
     * @param {string} redirectURI
     * @param {string} code
     * @returns {Promise<IToken>}
     */
    public async exchangeCodeForToken(redirectURI: string, code: string): Promise<IToken> {
        const requestOptions: request.Options = {
            uri: `https://${Constants.AUTH_HOST}/connect/token`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            form: {
                grant_type: "authorization_code",
                client_id: this.options.client_id,
                client_secret: this.options.client_secret,
                redirect_uri: redirectURI,
                code
            }
        };

        try {
            const response: string = await request.post(requestOptions);
            const parsedResponse: IAuthResponse = JSON.parse(response);
            return {
                access_token: parsedResponse.access_token,
                refresh_token: parsedResponse.refresh_token
            };
        } catch (error) {
            throw new ApiError(error);
        }
    }

    /**
     * Exchanges a refresh token for a fresh access token
     *
     * @param {string} refreshToken
     * @returns {Promise<IToken>}
     */
    public async refreshAccessToken(refreshToken: string): Promise<IToken> {
        const requestOptions: request.Options = {
            uri: `https://${Constants.AUTH_HOST}/connect/token`,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            form: {
                grant_type: "refresh_token",
                client_id: this.options.client_id,
                client_secret: this.options.client_secret,
                refresh_token: refreshToken
            }
        };

        try {
            const response: string = await request(requestOptions);
            const parsedResponse: IAuthResponse = JSON.parse(response);
            return {
                access_token: parsedResponse.access_token,
                refresh_token: parsedResponse.refresh_token
            };
        } catch (error) {
            throw new ApiError(error);
        }
    }

    /**
     * Returns whether the token has expired or not
     *
     * @param {string} accessToken
     * @returns {boolean}
     */
    public static isTokenExpired(accessToken: string): boolean {
        const decoded: IJWT = decode(accessToken);
        const expiry: number = decoded.exp;
        // TODO: use moment instead for date manipulation
        const now: number = Math.round(new Date().getTime() / 1000);
        return now - expiry > 0;
    }
}
