import { NextFunction, Request, Response } from "express";
import { verify } from "argon2";
import { sign } from "jsonwebtoken";
import { BadRequest, InternalServerError } from "http-errors";
import { User } from "../models/userModel";
import { logInfo } from "../services/loggingService";
import { LoginDto } from "../dtos/loginDto";
import { catchError } from "../utilities/catchError";

/**
 * User signup handler
 */
export const signup = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.create(req.body);

  logInfo("User account created", user);
  return res.success(201, "User account created successfully!", null);
});

/**
 * User Login handler
 */
export const login = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const payload: LoginDto = req.body;

  // Checking for account existence
  const user = await User.findOne({ email: payload.email });
  if (!user) throw BadRequest("Incorrect email or password");

  // Checking for password match
  const key = process.env.HASH_KEY;
  if (!key) throw InternalServerError("Internal: HASH_KEY not defined");

  const secret = Buffer.from(key);
  const doesMatch = await verify(user.password, payload.password, { secret });
  if (!doesMatch) throw BadRequest("Incorrect email or password");

  // Generating JWT token
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw InternalServerError("Internal: PRIVATE_KEY not defined");

  const expiresIn = process.env.EXPIRES_IN || "7d";
  const token = sign({ id: user._id, email: user.email }, privateKey, { expiresIn });

  return res.success(200, "Logged in successfully", { token });
});
