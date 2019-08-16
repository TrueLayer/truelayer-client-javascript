/**
 * Customer's direct debits and associated data - for use with /accounts endpoint
 * Docs: https://docs.truelayer.com/#retrieve-direct-debits
 *
 * @interface IDirectDebit
 */
export interface IDirectDebit {
    /** Unique identifier of the direct debit in a request. It may change between requests. */
    direct_debit_id: string;
    /** Name of the service or user returned by the Provider */
    name: string;
    /** This can either be Active or Inactive */
    status: string;
    /** Date of the latest payment */
    previous_payment_timestamp: string;
    /** Amount of the latest paymentt */
    previous_payment_amount: number;
    /** ISO 4217 alpha-3 currency code */
    currency: string;
    /** A collection of additional Provider specific transaction metadata * @type {IMeta} */
    meta?: IMeta;
    /** Date and time the request was made */
    timestamp: string;
}

/**
 * Direct debit meta
 *
 * @interface IMeta
 */
export interface IMeta {
    /** Provider mandate identification */
    provider_mandate_identification: string;
    /** Provider account identifier */
    provider_account_id: string;
}
