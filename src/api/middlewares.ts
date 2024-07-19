import {Express, NextFunction, Request, Response} from "express";
import {logger} from "../config/logger";
import * as bodyParser from 'body-parser';
import {TokenData, validateToken} from "../clients/authService";
import {appConfig} from "../config/load";

export const registerMiddlewares = (app: Express) => {
    // logger middleware
    app.use((req: Request, res: Response, next: NextFunction) =>{
        const userAgent: string = req.headers['user-agent'] || '';

        const message: string = `${req.method} - ${userAgent} - ${req.hostname} - ${req.path}`;

        logger.info(message);

        logger.debug(`Request body: ${JSON.stringify(req.body)}`);

        next();
    });

    app.use(bodyParser.json());

    // token verification middleware
    app.use(async (req: Request, res: Response, next: NextFunction) => {
        if (req.path === '/health') {
            return next();
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send('Unauthorized');
        }

        const token = authHeader.split(' ')[1];

        try {
            const response: TokenData = await validateToken(
                appConfig.authApiUrl,
                appConfig.authApiRealm,
                appConfig.authClientId,
                appConfig.authClientSecret,
                token
            );

            logger.info(`Token validated for ${response.preferred_username}`);

            req.body.tokenData = response;

            return next();
        } catch (error) {
            logger.error(`Token verification failed ${error}`);
            return res.status(401).send('Unauthorized');
        }
    });
}
