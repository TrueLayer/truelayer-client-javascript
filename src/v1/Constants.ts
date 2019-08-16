/**
 * Project wide constants
 * @class Constants
 */
export class Constants {
    // Constants
    public static readonly AUTH_URL: string = "https://auth.truelayer.com";
    public static readonly API_URL: string = "https://api.truelayer.com";
    public static readonly STATUS_URL: string = "https://status-api.truelayer.com";
    public static readonly API_TIMEOUT: number = 60000;
    public static readonly AVAILABLE_SCOPES: Array<string> = ["offline_access", "info", "accounts", "transactions", "balance", "cards", "direct_debits", "standing_orders"];
}
