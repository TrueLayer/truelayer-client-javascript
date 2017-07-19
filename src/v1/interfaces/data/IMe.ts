/**
 * Access token metadata - for use with /me endpoint
 * Docs: http://docs.truelayer.com/#retrieve-access_token-metadata
 *
 * @interface IMe
 */
export interface IMe {
    /** Your unique client identifier */
    client_id: string;
    /** Unique identifier of the set of credentials */
    credentials_id: string;
    /** Unique identifier of the Provider */
    provider_id: string;
}
