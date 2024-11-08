import { logger } from "../config/logging";

export function logInfo(message: string, data: any) {
  logger.info({
    message,
    data,
    env: process.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });
}

export function logError(message: string, error: unknown, data: any) {
  logger.error({
    message: message,
    data,
    error: error,
    env: process.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });
}
