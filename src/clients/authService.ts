import {JwksClient} from "jwks-rsa";
import {decode, Jwt} from "jsonwebtoken";
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

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

function findSigningKey(keys: jwksRsa.SigningKey[], decodedToken: Jwt): jwksRsa.SigningKey {
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

    const signingKeys: jwksRsa.SigningKey[] = await jwksClient.getSigningKeys();

    const decodedToken: Jwt | null = decode(token, {complete: true});

    if (!decodedToken) {
        throw new Error('Invalid token');
    }

    const signingKey: jwksRsa.SigningKey = findSigningKey(signingKeys, decodedToken);
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
