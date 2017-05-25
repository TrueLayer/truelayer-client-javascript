import IBalance from "./balance";

interface ITransaction {
    timestamp: string;
    description: string;
    transaction_type: string;
    amount: number;
    currency: string;
    balance: IBalance;
    meta: object;
}

export default ITransaction;
