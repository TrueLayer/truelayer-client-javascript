/**
 * Response format of results returned from auth-server calls.
 */

export interface IAuthResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token: string;
}
