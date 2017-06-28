import { ApiError } from "./APIError";
import { Constants } from "./Constants";
import { IAuthResponse } from "./interfaces/auth/IAuthResponse";
import { IOptions } from "./interfaces/auth/IOptions";
import { ITokenResponse } from "./interfaces/auth/ITokenResponse";
import * as moment from "moment";
import * as request from "request-promise";

/**
 * This class is responsible for performing the authentication steps
 *
 * @export
 * @class AuthAPIClient
 */
export class AuthAPIClient {

    private readonly options: IOptions;

    /**
     * Creates an instance of AuthAPIClient.
     * If no constructor options are passed then look for environment variables by default.
     *
     * @param {IOptions} options
     */
    constructor(options?: IOptions) {
        if (options) {
            this.options = options;
        } else if (process.env.CLIENT_ID || process.env.CLIENT_SECRET) {
            this.options = {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            };
        } else {
            throw new Error("Need to pass client_id and client_secret or set as environment variables");
        }
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
        // Check for valid scope values
        for (const grant of scope) {
            if (!AuthAPIClient.isValidScope(grant)) {
                throw new Error(`Provided scope is not valid: ${grant}`);
            }
        }

        const concatScope: string = scope.join(" ");
        let authUrl: string = `${Constants.AUTH_URL}/?` +
            `response_type=code&` +
            `response_mode=form_post&` +
            `client_id=${this.options.client_id}&` +
            `redirect_uri=${redirectURI}&` +
            `scope=${concatScope}&` +
            `nonce=${nonce}`;

        if (!!state) {
            authUrl += `&state=${state}`;
        }
        if (enableMock) {
            authUrl += `&enable_mock=true`;
        }
        return encodeURI(authUrl);
    }

    /**
     * Validates that a given string is a correct scope literal
     *
     * @private
     * @param {string} grant
     * @returns {boolean}
     */
    private static isValidScope(grant: string): boolean {
        switch (grant) {
            case "offline_access":
            case "info":
            case "accounts":
            case "transactions":
            case "balance":
                return true;
            default:
                return false;
        }
    }

    /**
     * Exchanges an auth code for an access token
     *
     * @param {string} redirectURI
     * @param {string} code
     * @returns {Promise<IToken>}
     */
    public async exchangeCodeForToken(redirectURI: string, code: string): Promise<ITokenResponse> {
        const requestOptions: request.Options = {
            uri: `${Constants.AUTH_URL}/connect/token`,
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
    public async refreshAccessToken(refreshToken: string): Promise<ITokenResponse> {
        const requestOptions: request.Options = {
            uri: `${Constants.AUTH_URL}/connect/token`,
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
}
