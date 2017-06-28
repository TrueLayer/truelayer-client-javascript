/**
 * Generic response type as returned by the Data APIs
 */
export interface IResponse<T> {
    success: boolean;
    error?: IError;
    results: T[];
}

/**
 * Response format for errors
 */
export interface IError {
    code: string;
    message?: string;
}
