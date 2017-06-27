/**
 * Customer's account and associated data - for use with /accounts endpoint
 * Docs: http://docs.truelayer.com/#list-all-accounts
 *
 * @interface IAccount
 */
export interface IAccount {
    /**
     * Unique identifier of the account
     */
    account_id: string;
    /**
     * Account Identifiers
     *
     * @type {IAccountNumber}
     */
    account_number: IAccountNumber;
    /**
     * Type of the account
     */
    account_type: string;
    /**
     * ISO 4217 alpha-3 currency code of the account
     */
    currency: string;
    /**
     * Optional description of account
     */
    description?: string;
    /**
     * Human readable name of the account
     */
    display_name?: string;
    /**
     * Last update time of the account information
     */
    update_timestamp: string;
}

/**
 * Account identifiers
 *
 * @interface IAccount
 */
export interface IAccountNumber {
    /**
     * ISO 13616-1:2007 international bank number
     */
    iban: string;
    /**
     * Bank account number
     */
    number: string;
    /**
     * United Kingdom sort code
     */
    sort_code: string;
    /**
     * ISO 9362:2009 Business Identifier Codes
     */
    swift_bic?: string;
}
