import * as request from "request-promise";
import * as validURL from "valid-url";
import IExchangeResponse from "./interfaces/IExchangeResponse";
import IAccessTokens from "./interfaces/IAccessTokens";
import IOptions from "./interfaces/IOptions";
import C from "./constants";

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
     * @param {string} scope
     * @param {string} nonce
     * @param {boolean} enableMock
     * @param {string} [state]
     * @returns {string}
     */
    public getAuthUrl(redirectURI: string, scope: string, nonce: string, enableMock?: boolean, state?: string): string {
        if (!validURL.isUri(redirectURI)) {
            throw new Error("Redirect uri provided is invalid");
        }

        let authUrl: string = `https://${C.AUTH_HOST}/?` +
            `response_type=code&` +
            `response_mode=form_post&` +
            `client_id=${this.options.client_id}&` +
            `redirect_uri=${redirectURI}&` +
            `scope=${scope}&` +
            `nonce=${nonce}`;

        if ( typeof state !== "undefined" ) {
            authUrl = authUrl + `&state=${state}`;
        }

        if ( typeof enableMock !== "undefined") {
            authUrl = authUrl + `&enable_mock=${enableMock}`;
        }

        return authUrl;
    }

    /**
     * Exchanges an auth code for an access token
     *
     * @param {string} redirectURI
     * @param {string} code
     * @returns {Promise<IAccessTokens>}
     */
    public async exchangeCodeForToken(redirectURI: string, code: string) {
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
            const parsedResponse: IExchangeResponse = JSON.parse(response);
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
    public async refreshAccessToken(refreshToken: string): Promise<IAccessTokens> {
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
            const parsedResponse: IExchangeResponse = JSON.parse(response);
            return {
                access_token: parsedResponse.access_token,
                refresh_token: parsedResponse.refresh_token
            };
        } catch (e) {
            return e;
        }

    }

}
