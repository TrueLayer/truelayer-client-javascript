/**
 * Customer's standing orders - for use with /accounts endpoint
 * Docs: https://docs.truelayer.com/#retrieve-standing-orders
 *
 * @interface IStandingOrder
 */
export interface IStandingOrder {
    /** Frequency of the standing order.
     * Possible values:
     *      EvryDay - every day
     *      EvryWorkgDay - every working day
     *      IntrvlDay:XX - every XX calendar day
     *      IntrvlMnthDay:XX:YY - every XXth month on the YYth day of the month
     *      IntrvlWkDay:XX:YY - every XXth week, on the YYth day of the week
     *      QtrDay - quarterly -
     *      WkInMnthDay:XX:YY - every month, on the XXth week of the month and on the YYth day of the week. */
    frequency: string;
    /** This can either be Active or Inactive */
    status: string;
    /** Date and time the request was made */
    timestamp: string;
    /** ISO 4217 alpha-3 currency code */
    currency: string;
    /** A collection of additional Provider specific transaction metadata * @type {IMeta} */
    meta?: IMeta;
    /** The date on which the next payment for the standing order schedule will be made */
    next_payment_date: string;
    /** Amount of the next payment for the standing order **/
    next_payment_amount: number;
    /** The date on which the first payment for the standing order schedule will be or was made */
    first_payment_date: string;
    /** Amount of the first payment for the standing order */
    first_payment_amount: number;
    /** The date on which the next payment for a Standing Order schedule will be made */
    final_payment_date: string;
    /** Amount of the last payment for the standing order */
    final_payment_amount: number;
    /** Reference of the standing order set by the user */
    reference: string;
    /** Date of the latest payment */
    previous_payment_timestamp: string;
    /** Amount of the latest payment */
    previous_payment_amount: number;
}

/**
 * Direct debit meta
 *
 * @interface IMeta
 */
export interface IMeta {
    /** Provider account identifier */
    provider_account_id: string;
}
