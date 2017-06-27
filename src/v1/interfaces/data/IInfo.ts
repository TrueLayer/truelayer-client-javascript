/**
 * Customer’s identity information held by the Provider - for use with /info endpoint
 * Docs: http://docs.truelayer.com/#retrieve-identity-information
 *
 * @interface IInfo
 */
export interface IInfo {
    /**
     * Address information
     *
     * @type {IAddressInfo[]}
     */
    addresses?: IAddressInfo[];
    /**
     * Date of birth of the Customer
     */
    date_of_birth?: string;
    /**
     * Email addresses
     */
    emails?: string[];
    /**
     * Full name of the Customer
     */
    full_name: string;
    /**
     * Phone numbers
     */
    phones?: string[];
    /**
     * Last time the data has been updated from the provider
     */
    update_timestamp?: string;
}

/**
 * Properties of an address - for use in IInfo
 *
 * @interface IAddressInfo
 */
export interface IAddressInfo {
    /**
     * Full address of the Customer
     */
    address?: string;
    /**
     * City
     */
    city?: string;
    /**
     * ISO-3166-1 alpha-3 code of the country
     */
    country?: string;
    /**
     * State
     */
    state?: string;
    /**
     * Post code
     */
    zip?: string;
}
