// Internal imports
import IAuthResponse from "./interfaces/IAuthResponse";
import IOptions from "./interfaces/IOptions";
import ITokens from "./interfaces/ITokens";
import IJWT from "./interfaces/IJWT";
import C from "./constants";

// External imports
import * as request from "request-promise";
import * as validURL from "valid-url";
import * as decode from "jwt-decode";

export default class Auth {

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
        // Check for valid redirect url
        if (!validURL.isUri(redirectURI)) {
            throw new Error("Redirect uri provided is invalid");
        }
        // Check for valid scope values
        for (const grant of scope) {
            if (!this.isValidScope(grant)) {
                throw Error("Error");   // TODO: Better error throw
            }
        }
        const concatScope: string = scope.join(" ");
        let authUrl: string = `https://${C.AUTH_HOST}/?` +
            `response_type=code&` +
            `response_mode=form_post&` +
            `client_id=${this.options.client_id}&` +
            `redirect_uri=${redirectURI}&` +
            `scope=${concatScope}&` +
            `nonce=${nonce}&` +
            `state=${state}`;

        if ( typeof state !== "undefined" ) {
            authUrl += `&state=${state}`;
        }
        if ( typeof enableMock !== "undefined") {
            authUrl += `&enable_mock=${enableMock}`;
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
    private isValidScope(grant: string): boolean {
        switch (grant) {
            case "offline_access":
            case "info":
            case "accounts":
            case "transactions":
            case "balance": { return true; }
            default: { return false; }
        }
    }

    /**
     * Exchanges an auth code for an access token
     *
     * @param {string} redirectURI
     * @param {string} code
     * @returns {Promise<ITokens>}
     */
    public async exchangeCodeForToken(redirectURI: string, code: string): Promise<ITokens> {
        if (!validURL.isUri(redirectURI)) {
            throw new Error("Redirect uri provided is invalid");
        }

        const requestOptions: request.Options = {
            uri: `https://${C.AUTH_HOST}/connect/token`,
            method: "POST",
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
            const response: string = await request(requestOptions);
            const parsedResponse: IAuthResponse = JSON.parse(response);
            return {
                access_token: parsedResponse.access_token,
                refresh_token: parsedResponse.refresh_token
            };
        } catch (e) {
            return e;
        }
    }

    /**
     * Exchanges a refresh token for a fresh access token
     *
     * @param {string} refreshToken
     * @returns {Promise<IAccessTokens>}
     */
    public async refreshAccessToken(refreshToken: string): Promise<ITokens> {
        const requestOptions: request.Options = {
            uri: `https://${C.AUTH_HOST}/connect/token`,
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
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns whether the token has expired or not
     *
     * @param {string} accessToken
     * @returns {boolean}
     */
    public isTokenExpired(accessToken: string): boolean {
        const decoded: IJWT = decode(accessToken);
        const expiry: number = decoded.exp;
        const now: number = Math.round(new Date().getTime() / 1000);
        if (now - expiry > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the time left before the JWT expires in milliseconds
     *
     * @param {string} accessToken
     * @returns {number}
     */
    public timeBeforeExpired(accessToken: string): number {
        const decoded: IJWT = decode(accessToken);
        const expiry: number = decoded.exp;
        const now: number = Math.round(new Date().getTime() / 1000);
        return Math.abs(now - expiry);
    }

}
