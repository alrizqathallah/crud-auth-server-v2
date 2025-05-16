import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import chalk from "chalk";
import path from "path";
import fs from "fs";

import config from "../configs/env.config";
import { TLogger } from "../types/logger.type";

/* Ensure logs directory exists */
const logDir = path.resolve(__dirname, "../../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

/* Format Filters */
const filterLogLevel = (levels: string[]) =>
  format((info) => (levels.includes(info.level) ? info : false))();

/* Formatters */
const logFileFormat = format.combine(
  format.timestamp({ format: "YYYY:MM:DD HH:mm:ss" }),
  format.printf(
    ({ timestamp, level, message }) =>
      `${timestamp} [${level.toUpperCase()}] ${message}`,
  ),
);

const logConsoleFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => {
    const colors: Record<string, (msg: string) => string> = {
      error: chalk.redBright,
      warn: chalk.yellowBright,
      info: chalk.blueBright,
      http: chalk.greenBright,
      debug: chalk.magentaBright,
    };
    const color = colors[level] ?? ((msg: string) => msg);
    return `${chalk.gray(timestamp)} [${color(level.toUpperCase())}] ${message}`;
  }),
);

/* Transport Creators */
const createFileTransport = (
  filename: string,
  level: string,
  filterLevels: string[],
) =>
  new transports.File({
    filename: path.join(logDir, filename),
    level,
    format: format.combine(filterLogLevel(filterLevels), logFileFormat),
  });

const createDailyRotateTransport = () =>
  new DailyRotateFile({
    dirname: logDir,
    filename: "app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
    format: format.combine(
      filterLogLevel(["info", "warn", "http"]),
      logFileFormat,
    ),
  });

/* Logger Factory */
const createAppLogger = (): TLogger => {
  const baseLogger: WinstonLogger = createLogger({
    level: config.NODE_ENV === "production" ? "info" : "debug",
    transports: [
      new transports.Console({ format: logConsoleFormat }),
      createDailyRotateTransport(),
      createFileTransport("error.log", "error", ["error"]),
      createFileTransport("access.log", "http", ["http"]),
      createFileTransport("debug.log", "debug", ["debug"]),
      createFileTransport("combined.log", "info", ["info", "warn"]),
    ],
  });

  const logger = baseLogger as TLogger;

  const originalError = baseLogger.error.bind(baseLogger);
  const originalWarn = baseLogger.warn.bind(baseLogger);
  const originalInfo = baseLogger.info.bind(baseLogger);
  const originalHttp = baseLogger.http?.bind(baseLogger) ?? (() => {});
  const originalDebug = baseLogger.debug.bind(baseLogger);

  logger.error = (message: string, error?: unknown) => {
    originalError(message, error);
    return logger;
  };
  logger.warn = (message: string) => {
    originalWarn(message);
    return logger;
  };
  logger.info = (message: string) => {
    originalInfo(message);
    return logger;
  };
  logger.http = (message: string) => {
    originalHttp(message);
    return logger;
  };
  logger.debug = (message: string) => {
    originalDebug(message);
    return logger;
  };

  return logger;
};

const logger2 = createAppLogger();

export default logger2;
