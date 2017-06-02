export interface IInfo {
    full_name: string;
    update_timestamp?: string;
    date_of_birth?: string;
    addresses?: [IAddressInfo];
    emails?: [string];
    phones?: [string];
}

export interface IAddressInfo {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}
