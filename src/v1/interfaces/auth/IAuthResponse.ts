/**
 * Authorization server response structure
 * Docs: http://docs.truelayer.com/#exchange-code-with-access_token
 *
 * @interface IAuthResponse
 */
export interface IAuthResponse {
    /**
     * A short-lived JWT token used to access data on behalf of the Customer
     */
    access_token: string;
    /**
     * access_token validity in seconds. Default is 1 hour
     */
    expires_in: number;
    /**
     * A long lived code use to obtain a new access_token when expired.
     * It will be returned only if the scope offline_access was requested
     */
    refresh_token: string;
    /**
     * Must be: Bearer
     */
    token_type: string;
}
