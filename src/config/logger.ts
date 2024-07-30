import {createLogger, format, Logger, transports} from 'winston';
import {appConfig} from "./load";

class AppLogger {
    private static instance: Logger;

    private constructor() {
        // private to prevent direct construction calls
    }

    static getInstance(): Logger {
        if (!AppLogger.instance) {
            AppLogger.instance = createLogger({
                level: appConfig.logLevel,
                format: format.json(),
                defaultMeta: { service: 'plaid-integration' },
                transports: [
                    new transports.Console(),
                ],
            });
        }

        return AppLogger.instance;
    }

    info(message: string) {
        AppLogger.instance.info(message);
    }

    error(message: string) {
        AppLogger.instance.error(message);
    }

    warn(message: string) {
        AppLogger.instance.warn(message);
    }

    debug(message: string) {
        AppLogger.instance.debug(message);
    }
}

export const logger: AppLogger = AppLogger.getInstance();
