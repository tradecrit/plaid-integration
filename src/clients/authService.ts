export interface TokenData {
    exp: number
    iat: number
    auth_time: number
    jti: string
    iss: string
    aud: string
    sub: string
    typ: string
    azp: string
    nonce: string
    session_state: string
    acr: string
    "allowed-origins": string[]
    realm_access: RealmAccess
    resource_access: ResourceAccess
    scope: string
    sid: string
    email_verified: boolean
    preferred_username: string
    email: string
}

export interface RealmAccess {
    roles: string[]
}

export interface ResourceAccess {
    account: Account
}

export interface Account {
    roles: string[]
}


export async function validateToken(
    authApiUrl: string,
    authApiRealm: string,
    client_id: string,
    client_secret: string,
    token: string
): Promise<TokenData> {
    const fullUrl = `${authApiUrl}/realms/${authApiRealm}/protocol/openid-connect/token/introspect`;

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('token', token);
    urlencoded.append('client_id', client_id);
    urlencoded.append('client_secret', client_secret);
    urlencoded.append('grant_types', 'client_credentials');

    const requestOptions: RequestInit = {
        method: "POST",
        headers: headers,
        body: urlencoded,
        redirect: "follow"
    };

    const response: Response = await fetch(fullUrl, requestOptions);

    if (response.status !== 200) {
        throw new Error(`Failed to validate token: ${response.statusText}`);
    } else {
        return response.json();
    }
}
