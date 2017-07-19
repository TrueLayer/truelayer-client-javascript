/**
 * Balance information for a specific account - for use with /accounts/{account_id}/balance endpoint
 * Docs: http://docs.truelayer.com/#retrieve-account-balance
 *
 * @interface IBalance
 */
export interface IBalance {
    /** Available balance */
    available: number;
    /** ISO 4217 alpha-3 currency code */
    currency: string;
    /** Current balance */
    current: number;
    /** Last update time */
    update_timestamp: string;
}
