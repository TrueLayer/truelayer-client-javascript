export interface IResponse<T> {
    success: boolean;
    error?: IError;
    results: T[];
}

export interface IError {
    code: string;
    message?: string;
}

export default IResponse;
