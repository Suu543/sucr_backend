const fs = require("fs");
const path = require("path");
const { createLogger, format, transports, exceptions } = require("winston");
const { combine, timestamp, label, printf } = format;
const moment = require("moment");
require("winston-daily-rotate-file"); // 당일 log 확인시 사용에 용이

function tsFormat() {
  return moment.format("YYYY-MM-DD HH:mm:ss.SSS ZZ");
}

const logDir = __dirname + "/../logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const infoTransport = new transports.File({
  filename: "info.log",
  dirname: logDir,
  level: "info",
});

const errorTransport = new transports.File({
  filename: "error.log",
  dirname: logDir,
  level: "error",
});

const transport = new transports.DailyRotateFile({
  filename: path.join(__dirname, "../logs/testLog.log"),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "1d",
  timestamp: tsFormat,
});

const consoleTransport = new transports.Console({
  level: "silly",
  handleExceptions: true,
  colorize: true,
  prettyPrint: true,
});

const logger = createLogger({
  format: combine(
    label({
      label: "CustomLogger",
    }),
    timestamp(),
    myFormat
  ),
  transports: [infoTransport, errorTransport, consoleTransport, transport],
});

const handleException = new transports.File({
  filename: path.join(__dirname, "../logs/exceptionLog.log"),
  handleExceptions: true,
});

logger.exceptions.handle(handleException);

const stream = {
  write: (message) => {
    logger.info(message);
  },
};

module.exports = {
  logger,
  stream,
};
