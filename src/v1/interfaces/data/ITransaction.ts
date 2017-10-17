/**
 * Transaction information for a single transaction - for use with /accounts/v1/{account_id}/transactions endpoint
 * Docs: http://docs.truelayer.com/#retrieve-account-transactions
 *
 * @interface ITransaction
 */
export interface ITransaction {
    /** Amount of the transaction */
    amount: number;
    /** ISO 4217 alpha-3 currency code */
    currency: string;
    /** Original description of the transaction as reported by the Provider */
    description: string;
    /** ID of the transaction **/
    transaction_id: string;
    /** A collection of additional Provider specific transaction metadata */
    meta: object;
    /** Date the transaction was posted on the account */
    timestamp: string;
    /** Type of the transaction */
    transaction_type: string;
}
