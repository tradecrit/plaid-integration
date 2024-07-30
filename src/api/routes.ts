import {Express, Request, Response} from "express";
import {logger} from "../config/logger";
import {appConfig} from "../config/load";
import {PlaidLinkCreateTokenResponse, PlaidPublicTokenExchangeResponse} from "../models/plaid";
import {TokenData} from "../clients/authService";


export const registerRoutes = (app: Express) => {
    app.get('/health', (req: Request, res: Response) => {
        logger.debug('Health check passed');

        res.send('ok');
    });

    app.post('/create-link-token', async (req: Request, res: Response) => {
        logger.info('Creating link token');

        const tokenData: TokenData = req.body.tokenData;
        const userId: string = tokenData.sub;

        const headers = {
            'Content-Type': 'application/json'
        }

        const requestBody = {
            "client_id": appConfig.plaidClientId,
            "secret": appConfig.plaidSecret,
            "client_name": "TradeCrit",
            "user": {"client_user_id": userId},
            "products": appConfig.plaidProducts,
            "country_codes": ["US"],
            "language": "en",
        }

        const response = await fetch(`https://${appConfig.plaidEnv}.plaid.com/link/token/create`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        if (response.status !== 200) {
            logger.error(await response.text());
            res.status(500).send('Failed to create link token');
        }

        const responseBody: PlaidLinkCreateTokenResponse = await response.json();

        logger.info(`Link token created for user ${userId}`);

        res.status(200).send(responseBody);
    });

    app.post('/exchange-public-token', async (req: Request, res: Response) => {
        logger.info('Exchanging public token for access token');

        if (!req.body || !req.body.public_token) {
            res.status(400).send('Missing public token in request body');
        }

        const publicToken: string = req.body.public_token;

        const headers = {
            'Content-Type': 'application/json'
        }

        const requestBody = {
            "client_id": appConfig.plaidClientId,
            "secret": appConfig.plaidSecret,
            "public_token": publicToken,
        }

        const response = await fetch(`https://${appConfig.plaidEnv}.plaid.com/item/public_token/exchange `, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        if (response.status !== 200) {
            logger.error(await response.text());
            res.status(500).send('Failed to exchange public token');
        }

        const responseBody: PlaidPublicTokenExchangeResponse = await response.json();

        logger.info(`Access token created for user`);

        res.status(200).send(responseBody);
    });
}
