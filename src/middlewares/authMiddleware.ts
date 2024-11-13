import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "http-errors";
import { decode, JwtPayload } from "jsonwebtoken";
import { User } from "../models/userModel";

// Extending Request interface for type support
declare global {
  namespace Express {
    interface Request {
      user: { id: string; email: string };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Check for Authorization header
  const authorization = req.headers["authorization"];
  if (!authorization) next(Unauthorized("Authentication required"));

  // Check if token is Bearer token
  const token = authorization?.split(" ")[1];
  if (!token) next(Unauthorized("Authentication required"));

  // Check if token is valid
  const payload = decode(token!) as JwtPayload | null;
  if (!payload) next(Unauthorized("Authentication required"));

  const user = await User.findById(payload?.id);
  if (!user) next(Unauthorized("Authentication required"));

  // Set user object on Request object
  req.user = { id: payload?.id, email: payload?.email };
  next();
};
