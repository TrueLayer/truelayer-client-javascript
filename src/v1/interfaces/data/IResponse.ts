/**
 * Generic result format as returned by the Data API
 * Docs: http://docs.truelayer.com/#api-response-structure
 *
 * @interface IResult
 * @template T
 */
export interface IResult<T> {
    /** An array of results objects of type <T> */
    results: T[];
}

/**
 * Response format for errors
 *
 * @interface IError
 */
export interface IError {
    /** The error code and associated HTTP status */
    error: string;
    /** Finer grain detail of the error */
    error_description: string;
}
