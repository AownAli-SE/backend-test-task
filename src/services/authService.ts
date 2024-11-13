import { BadRequest, InternalServerError, NotFound } from "http-errors";
import { hash, verify } from "argon2";
import { sign } from "jsonwebtoken";

import { LoginDto } from "../dtos/loginDto";
import { UserDto } from "../dtos/signupDto";
import { User } from "../models/userModel";
import { generateRandomPassword } from "../utilities/generateRandomPassword";
import { sendEmail } from "./mailService";
import { ChangePasswordDto, UserBasicInfoDto } from "../dtos/userDtos";

// User Signup
export const createUser = async (payload: UserDto) => {
  payload.password = generateRandomPassword();
  const user = await User.create(payload);
  await sendEmail(payload.email, payload.password);

  return user;
};

// User login
export const loginUser = async (payload: LoginDto) => {
  const user = await getUserByEmail(payload.email);
  const doesMatch = await verifyUser(user.password, payload.password);
  if (!doesMatch) throw BadRequest("Incorrect email or password");

  return generateToken(user);
};

// Get user basic info
export const getUserDetails = async (userId: string) => {
  const user = await User.findById(userId, "firstname lastname dateOfBirth");
  if (!user) throw NotFound("User doesn't exist");

  return user;
};

// Update user basic info
export const updateBasicUserInfo = async (payload: UserBasicInfoDto, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw NotFound("User doesn't exist");

  user.firstname = payload.firstname;
  user.lastname = payload.lastname;
  user.dateOfBirth = payload.dateOfBirth;
  await user.save();

  return user;
};

// Change user password
export const changePassword = async (payload: ChangePasswordDto, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw NotFound("User doesn't exist");

  const doesMatch = await verifyUser(user.password, payload.currentPassword);
  if (doesMatch) {
    const hashedPassword = await hashPassword(payload.newPassword);
    user.password = hashedPassword;
    await user.save();

    return true;
  }

  return false;
};

// Reset password
export const resetPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw NotFound(`User with email ${email} doesn't exist`);

  const password = generateRandomPassword();
  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;
  await user.save();

  const emailSubject = "Your new password";
  const html = `<p>You have requested for a new password. Here is your new password: <b>${password}</b></p>`;
  await sendEmail(email, password, emailSubject, html);
};

// Helper methods
async function getUserByEmail(email: string) {
  const user = await User.findOne({ email });
  if (!user) throw BadRequest("Incorrect email or password");
  return user;
}

async function verifyUser(hashedPassword: string, enteredPassword: string) {
  const key = process.env.HASH_KEY;
  if (!key) throw InternalServerError("Internal: HASH_KEY not defined");

  const secret = Buffer.from(key);
  const doesMatch = await verify(hashedPassword, enteredPassword, { secret });
  return doesMatch;
}

async function generateToken(user: UserDto) {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw InternalServerError("Internal: PRIVATE_KEY not defined");

  const expiresIn = process.env.EXPIRES_IN || "7d";
  return sign({ id: user._id, email: user.email }, privateKey, { expiresIn });
}

async function hashPassword(password: string) {
  const key = process.env.HASH_KEY;
  if (!key) throw InternalServerError("Hash key not defined");

  const secret = Buffer.from(key);
  const newHashedPassword = await hash(password, { secret });
  return newHashedPassword;
}
