/**
 * Generic response structure as returned by the Data API
 * Docs: http://docs.truelayer.com/#api-response-structure
 *
 * @interface IResponse
 * @template T
 */
export interface IResponse<T> {
    /**
     * A boolean value that indicates if the request has been successful or not
     */
    success: boolean;
    /**
     * If an error occurred, this field will be an object with a code and a message fields
     */
    error?: IError;
    /**
     * An array of results objects of type <T>
     */
    results: T[];
}

/**
 * Response format for errors
 *
 * @interface IError
 */
export interface IError {
    /**
     * The error code and associated HTTP status
     */
    code: string;
    /**
     * Finer grain detail of the error
     */
    message?: string;
}
