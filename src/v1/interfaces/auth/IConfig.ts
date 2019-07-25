/**
 * Configuration to be passed to the AuthAPIClient getAuthUrl method to generate an auth url
 *
 * @interface IConfig
 */
export interface IConfig {
    /** List of requested permissions */
    scope: string[];
    /** Redirect url to be redirect once the process finishes */
    redirectURI: string;
    /** Unique random client value */
    nonce: string;
    /** An opaque value used by the Client to maintain state between the request and callback */
    state?: string;
    /** form_post or empty value */
    responseMode?: string;
    /** The authentication dialog will show a fictitious bank named "Mock" for testing */
    enableMock?: boolean;
    /** The authentication dialog will show all available Credential-sharing Providers.
     * If omitted, this is set to true by default. */
    enableCredentialsSharing?: boolean;
    /** The authentication dialog will show all available Credential-sharing Providers for Germany */
    enableCredentialsSharingDe?: boolean;
    /** The authentication dialog will show all available oAuth Providers */
    enableOauth?: boolean;
    /** The authentication dialog will show all available Open Banking Providers */
    enableOpenBanking?: boolean;
    /** List of provider ids to be hidden in the authentication dialog */
    disableProviders?: string[];
    /** Provider selection will be skipped */
    providerId?: string;
}