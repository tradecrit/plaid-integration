import JwksRsa, {JwksClient} from "jwks-rsa";
import {decode, Jwt} from "jsonwebtoken";
import {promisify} from "node:util";
import * as jwt from 'jsonwebtoken';

export interface TokenData {
    "aud": string
    "azp": string
    "exp": number
    "iat": number
    "iss": string
    "jti": string
    "org_code": string
    "permissions": string[]
    "scp": string[]
    "sub": string
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

function findSigningKey(keys: JwksRsa.SigningKey[], decodedToken: Jwt): JwksRsa.SigningKey {
    const key = keys.find((key) => key.kid === decodedToken.header.kid);

    if (!key) {
        throw new Error('Signing key not found');
    }

    return key;
}

export async function validateToken(
    authApiUrl: string,
    token: string
): Promise<TokenData> {
    const jwksUrl: string = `${authApiUrl}/.well-known/jwks`;

    const jwksClient: JwksClient = new JwksClient({
        jwksUri: jwksUrl,
    });

    const signingKeys: JwksRsa.SigningKey[] = await jwksClient.getSigningKeys();

    const decodedToken: Jwt | null = decode(token, {complete: true});

    if (!decodedToken) {
        throw new Error('Invalid token');
    }

    const signingKey: JwksRsa.SigningKey = findSigningKey(signingKeys, decodedToken);
    const publicKey: string = signingKey.getPublicKey();

    const result = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: authApiUrl,
    });

    if (typeof result !== 'object') {
        throw new Error('Invalid token');
    }

    if (!result || !result.sub) {
        throw new Error('Invalid token');
    }

    return result as TokenData;
}
