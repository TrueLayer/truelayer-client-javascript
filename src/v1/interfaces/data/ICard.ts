/**
 * Customer's credit cards account - for use with /cards endpoint
 * Docs: http://docs.truelayer.com/#list-all-cards
 *
 * @interface ICard
 */
export interface ICard {
    /** Unique identifier of the account */
    account_id: string;
    /** Processing network (eg: VISA) **/
    card_network: string;
    /** Type of the card **/
    card_type: string;
    /** ISO 4217 alpha-3 currency code of the account */
    currency: string;
    /** Human readable name of the account */
    display_name?: string;
    /** Provider details **/
    provider: IProvider;
    /** Last 4 digits of the card **/
    partial_card_number: string;
    /** Name on the card **/
    name_on_card?: string;
    /** Valid date from **/
    valid_from?: string;
    /** Valid date to **/
    valid_to?: string;
    /** Last update time of the card information */
    update_timestamp: string;
}


/**
 * Account identifiers
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
