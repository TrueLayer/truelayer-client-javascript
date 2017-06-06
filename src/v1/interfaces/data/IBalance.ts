/**
 * Response format returned by the /balance endpoint
 */

export interface IBalance {
    currency: string;
    available: number;
    current: number;
    update_timestamp: string;
}
