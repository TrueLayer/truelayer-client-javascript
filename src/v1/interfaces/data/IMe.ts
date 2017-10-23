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
    /** Provider Identifiers     * @type {IProvider} **/
    provider: IProvider;
}

/**
 * Provider identifiers
 *
 * @interface IProvider
 */
export interface IProvider {
    /** Provider name */
    display_name: string;
    /** Provider logo uri */
    logo_uri: string;
    /** Provider ID **/
    provider_id: string;
}

