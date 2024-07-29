import * as dotenv from "dotenv";
import {logger} from "./logger";

type AppConfig = {
    port: number;
    address: string;
    frontendUrl: string;
    authApiUrl: string;
    plaidClientId: string;
    plaidSecret: string;
    plaidEnv: string;
    plaidProducts: string[];
}

function safeLoadEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} not found`);
    }

    return value;
}

class Config {
    address: string;
    port: number;
    frontendUrl: string;
    plaidClientId: string;
    plaidSecret: string;
    plaidEnv: string;
    plaidProducts: string[];
    authApiUrl: string;

    constructor() {
        const config: AppConfig = this.getConfig();

        this.address = config.address;
        this.port = config.port;
        this.frontendUrl = config.frontendUrl;
        this.plaidClientId = config.plaidClientId;
        this.plaidSecret = config.plaidSecret;
        this.plaidEnv = config.plaidEnv;
        this.plaidProducts = config.plaidProducts;
        this.authApiUrl = config.authApiUrl;
    }

    getConfig(): AppConfig {
        let envConfig = process.env;

        try {
            const loaded_env = dotenv.config({path: ".env"});
            const parsed_env = loaded_env.parsed || {};

            envConfig = {...envConfig, ...parsed_env};
        } catch (error) {
            logger.warn(`Could not load .env file ${error}`);
            envConfig = {...envConfig, ...process.env};
        }

        const rawPort: string = envConfig.PORT || "8080";
        const port: number = parseInt(rawPort.replace(/"/g, ''));

        const rawAddress: string = envConfig.ADDRESS || "0.0.0.0";
        const address: string = rawAddress.replace(/"/g, '');

        const rawPlaidProducts: string = safeLoadEnvVar("PLAID_PRODUCTS");
        const plaidProducts = rawPlaidProducts.split(",").map((product) => product.trim());

        return {
            port: safeLoadEnvVar("PORT") ? port : 8080,
            address: safeLoadEnvVar("ADDRESS") ? address : "localhost",
            frontendUrl: safeLoadEnvVar("FRONTEND_URL"),
            plaidClientId: safeLoadEnvVar("PLAID_CLIENT_ID"),
            plaidSecret: safeLoadEnvVar("PLAID_SECRET"),
            plaidEnv: safeLoadEnvVar("PLAID_ENV"),
            plaidProducts: plaidProducts,
            authApiUrl: safeLoadEnvVar("AUTH_API_URL"),
        };
    }
}

export const appConfig = new Config();
