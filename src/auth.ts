import * as request from "request-promise";
import IOptions from "./IOptions";
import C from "./constants"

interface IAccessTokens {
    access_token: string,
    refresh_token: string
}

interface IExchangeReponse {
    access_token: string,
    expires_in: number,
    token_type: string,
    refresh_token: string
}

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
     * @param {any} [scope=this.default_scope] 
     * @param {string} [nonce=this.default_nonce] 
     * @param {string} [state=this.default_state] 
     * @param {boolean} [mock=false] 
     * @returns {string} 
     * 
     * @memberof Auth
     */
    // TODO: remove nonce and state default
    public getAuthUrl(scope = C.SCOPE, nonce: string = C.NONCE, state?: string, mock: boolean = C.MOCK): string {

        return `https://${C.AUTH_HOST}/?` +
               `response_type=code&` +
               `response_mode=form_post&` +
               `client_id=${this.options.client_id}&` +
               `redirect_uri=${this.options.redirect_uri}&` +
               `scope=${scope}&` +
               `nonce=${nonce}&` +
               `state=${state}&` +
               `enable_mock=${mock}`;
    };

    /**
     * Exchanges an auth code for an access token
     * 
     * @param {string} code 
     * @returns {Promise<IAccessTokens>} 
     * 
     * @memberof Auth
     */
    public async exchangeCodeForToken(code: string): Promise<IAccessTokens> {
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
                redirect_uri: this.options.redirect_uri,
                code
            }
        };

        const response: string = await request(requestOptions);
        const parsedResponse: IExchangeReponse = JSON.parse(response);
        return {
            access_token: parsedResponse.access_token,
            refresh_token: parsedResponse.refresh_token
        };
    };

    /**
     * Exchanges a refresh token for a fresh access token
     * 
     * @param {string} refreshToken 
     * @returns {Promise<IAccessTokens>} 
     * 
     * @memberof Auth
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

        const response: string = await request(requestOptions);
        const parsedResponse: IExchangeReponse = JSON.parse(response);
        return {
            access_token: parsedResponse.access_token,
            refresh_token: parsedResponse.refresh_token
        };
    }

}
