export interface IStatusInfo {
    /** A string containing the provider id */
    providers: IProviderStatus[];
    /** The start of a one-hour time bucket */
    timestamp: string;
}

export interface IProviderStatus {
    /** A string containing the provider id */
    provider_id: string;
    /** Array of availability data for requested endpoints  * @type {IEndpoint} */
    endpoints: IEndpoint[];
}

export interface IEndpoint {
    /** Partial URL of the endpoint */
    endpoint: string;
    /** The percentage of successful requests for a provider's endpoint represented as a float value between 0-100 */
    availability: number;
    /** The percentage of unsuccessful requests (that we know are on the provider side) for a provider's endpoint represented as a float value between 0-100 */
    provider_error: number;
    /** The percentage of unsuccessful requests (due to TrueLayer) for a provider's endpoint represented as a float value between 0-100 */
    truelayer_error: number;
}
