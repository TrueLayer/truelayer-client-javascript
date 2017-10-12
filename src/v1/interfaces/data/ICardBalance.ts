/**
 * Card Balance information for a specific account - for use with /cards/{account_id}/balance endpoint
 * Docs: http://docs.truelayer.com/#retrieve-account-balance
 *
 * @interface ICardBalance
 */
export interface ICardBalance {
    /** Available balance */
    available: number;
    /** ISO 4217 alpha-3 currency code */
    currency: string;
    /** Current balance */
    current: number;
    /** Credit card limit **/
    credit_limit: number;
    /** Card balance at time of last statment **/
    last_statement_balance?: number;
    /** Date of last statement **/
    last_statement_date?: string;
    /** Amount required by due date **/
    payment_due?: number;
    /** Date by which payment due should be remitted  **/
    payment_due_date?: string;
    /** Last update time */
    update_timestamp: string;
}
