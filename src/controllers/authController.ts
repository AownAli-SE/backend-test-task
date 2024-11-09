import { NextFunction, Request, Response } from "express";

import { LoginDto } from "../dtos/loginDto";
import { catchError } from "../utilities/catchError";

import { logInfo } from "../services/loggingService";
import { createUser, loginUser } from "../services/authService";

// Signup route handler
export const signup = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const user = await createUser(req.body);
  logInfo("User account created", user);
  return res.success(201, "User account created successfully!", null);
});

// login route handler
export const login = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const payload: LoginDto = req.body;
  const token = await loginUser(payload);
  return res.success(200, "Logged in successfully", { token });
});
