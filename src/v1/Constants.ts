export class Constants {
    // Constants
    // TODO: don't mix URL and HOSTS. Use URLs
    public static readonly AUTH_HOST: string = "auth.truelayer.com";
    public static readonly API_HOST: string = "https://api.truelayer.com";
}

// TODO: move this into IJWT and export
type Scope = "info" | "accounts" | "transactions" | "balance" | "offline_access";
