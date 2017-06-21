/**
 * Response format as returned by the /transactions endpoint
 */
export interface ITransaction {
    timestamp: string;
    description: string;
    transaction_type: string;
    amount: number;
    currency: string;
    meta: object;
}
