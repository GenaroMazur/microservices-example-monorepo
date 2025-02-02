import * as winston from "winston";
import { getEnvironments } from "./getEnvironments.utils";
import { Environments } from "../enums/Environments.enum";
import { LogLevels } from "../enums/LogLevels.enum";

const colors = {
  error: "red",
  warn: "yellow",
  http: "gray",
  websocket: "gray",
  info: "green",
  verbose: "magenta",
  debug: "blue",
};

winston.addColors(colors);

const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    const msg = `${timestamp} [${level.toUpperCase()}]: ${typeof message === "string" ? message : JSON.stringify(message)}`;
    const metaStr = Object.keys(metadata).length
      ? `\n${JSON.stringify(metadata, null, 2)}`
      : "";
    return msg + metaStr;
  },
);

const loggerLevel = getEnvironments(Environments.LOG_LEVEL);

if (!Object.values(LogLevels).includes(loggerLevel as LogLevels)) {
  throw new Error(`Invalid log level ${loggerLevel}`);
}

export const logger = winston.createLogger({
  level: loggerLevel,
  levels: {
    error: 0,
    warn: 1,
    http: 2,
    websocket: 2,
    info: 3,
    verbose: 4,
    debug: 5,
  },
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat,
  ),
  transports: [
    new winston.transports.Console({
      level: loggerLevel,
      format: winston.format.combine(winston.format.colorize({ all: true })),
    }),
  ],
});
