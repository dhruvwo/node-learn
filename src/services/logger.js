const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint } = format;

const myFormat = printf(({ level, meta, timestamp, message }) => {
  return `${timestamp} ${level}: ${meta?.message || ""} : ${message}`;
});
const logger = createLogger({
  format: combine(
    format.json(),
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint(),
    myFormat
  ),
  transports: [
    new transports.File({
      filename: "logs/general.log",
    }),
    new transports.File({
      level: "error",
      filename: "logs/error.log",
    }),
    new transports.Console(),
  ],
});

module.exports = logger;
