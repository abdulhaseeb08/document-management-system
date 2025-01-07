import pino from "pino";
import type {Logger} from "pino";
import fs from "fs";
import { loggerConfig } from "./config";

const stream = fs.createWriteStream(loggerConfig.logFile, {flags: 'w'})

const logger: Logger = pino(
    {
        level: loggerConfig.level,
        formatters: {
            level: (label) => {
                return {
                    level: label
                }
            }
        }
    },
    stream
);

export default logger;