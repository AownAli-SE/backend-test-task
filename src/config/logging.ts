import path from "path";
import { createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const logger = createLogger({
  level: "info",
  format: format.combine(format.colorize(), format.json()),
  transports: [
    new DailyRotateFile({
      filename: path.join(__dirname, "..", "..", "logs", "info", "info-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "info",
    }),
    new DailyRotateFile({
      filename: path.join(__dirname, "..", "..", "logs", "errors", "errors-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
    }),
  ],
});
