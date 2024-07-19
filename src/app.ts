import {logger} from "./config/logger";
import {app} from "./api";
import {appConfig} from "./config/load";

logger.info('Starting Express');

const listening_at: string = `${appConfig.address}:${appConfig.port}`;

logger.info(`Listening at ${listening_at}`);

app.listen(appConfig.port, () => {
    logger.info("Server successfully started");
});
