/**
 * Transaction information for a single transaction - for use with /cards/v1/{account_id}/transactions endpoint
 * Docs: http://docs.truelayer.com/#retrieve-card-transactions
 *
 * @interface ICardTransaction
 */
export interface ICardTransaction {
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
}
