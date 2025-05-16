import { app } from "./app";
import config from "./configs/env.config";
// import logger from "./utils/logger";
import logger2 from "./utils/logger2";

const port = config.PORT || 8001;
const env = config.NODE_ENV || "developement";

const server = app.listen(port, () => {
  logger2.info(`Server is running on port ${port} in ${env} mode`);
});

export { server, port, env };
