import { NextFunction, Request, Response } from "express";

// Extending Response interface for type support
declare global {
  namespace Express {
    interface Response {
      success: (statusCode: number, message: string, data: any) => void;
      error: (statusCode: number, message: string) => void;
    }
  }
}

// setting error and success function on Response object
export function responseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.success = (statusCode: number, message: string, data: any) => {
    res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  };

  res.error = (statusCode: number, message: string) => {
    res.status(statusCode).json({
      status: "error",
      message,
      statusCode,
    });
  };

  next();
}
