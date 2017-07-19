/**
 * Data type defining the access and refresh tokens returned by exchangeCodeForToken()
 * Docs: http://docs.truelayer.com/#exchange-code-with-access_token
 *
 * @interface ITokenResponse
 */
export interface ITokenResponse {
    /** A short-lived JWT token used to access data on behalf of the Customer */
    access_token: string;
    /** A long lived code use to obtain a new access_token when expired. It will be returned only if the scope offline_access was requested */
    refresh_token: string;
}
