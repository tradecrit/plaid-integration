import express = require("express");
import cors = require("cors");

import {appConfig} from "../config/load";

import {logger} from "../config/logger";
import {registerMiddlewares} from "./middlewares";
import {registerRoutes} from "./routes";

const initialize = () => {
    const app = express();

    app.use(cors({
        origin: appConfig.frontendUrl,
        credentials: true,
    }));

    registerMiddlewares(app);
    registerRoutes(app);

    logger.info("Application initialized");

    return app;
}

export const app: express.Express = initialize();
