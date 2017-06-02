export interface IAccount {
    update_timestamp: string;
    account_id: string;
    account_type: string;
    display_name?: string;
    description: string;
    currency: string;
    account_number: IAccountNumber;
}

export interface IAccountNumber {
    iban: string;
    swift_bic: string;
    number: string;
    sort_code: string;
}
