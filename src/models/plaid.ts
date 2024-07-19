export interface PlaidLinkCreateTokenResponse {
    link_token: string;
    expiration: string;
    request_id: string;
}

export interface PlaidPublicTokenExchangeResponse {
    access_token: string;
    item_id: string;
    request_id: string;
}
