import { NextFunction, Request, Response } from "express";

import { LoginDto } from "../dtos/loginDto";
import { catchError } from "../utilities/catchError";

import { logInfo } from "../services/loggingService";
import {
  createUser,
  loginUser,
  changePassword as changeUserPassword,
  getUserDetails,
  updateBasicUserInfo,
  resetPassword,
} from "../services/authService";
import { ChangePasswordDto } from "../dtos/userDtos";

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

// Change password route handler
export const changePassword = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const payload: ChangePasswordDto = {
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  };

  const isChanged = await changeUserPassword(payload, req.user.id);
  const statusCode = isChanged ? 200 : 400;
  const message = isChanged ? "Password changed successfully" : "Current password is not correct";
  return res.success(statusCode, message, null);
});

// Get basic user info route handler
export const getBasicUserDetails = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const user = await getUserDetails(req.user.id);
  return res.success(200, "Account details fetched successfully!", user);
});

// Update basic user info route handler
export const updateBasicInfo = catchError(async (req: Request, res: Response, next: NextFunction) => {
  await updateBasicUserInfo(req.body, req.user.id);
  return res.success(200, "Basic info updated successfully!", null);
});

// Forget password request
export const forgetPassword = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  await resetPassword(email);
  return res.success(200, "Password changed! Please check your email", null);
});
