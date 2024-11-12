import { logger } from "../config/logging";

// Logging info helper function
export function logInfo(message: string, data: any) {
  logger.info({
    message,
    data,
    env: process.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });
}

// Logging error helper function
export function logError(message: string, error: unknown, data: any) {
  logger.error({
    message: message,
    data,
    error: error,
    env: process.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });
}
