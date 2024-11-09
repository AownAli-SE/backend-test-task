import { BadRequest, InternalServerError } from "http-errors";
import { verify } from "argon2";
import { sign } from "jsonwebtoken";

import { LoginDto } from "../dtos/loginDto";
import { UserDto } from "../dtos/signupDto";
import { User } from "../models/userModel";
import { generateRandomPassword } from "../utilities/generateRandomPassword";
import { sendWelcomeEmail } from "./mailService";

export const createUser = async (payload: UserDto) => {
  payload.password = generateRandomPassword();
  const user = await User.create(payload);
  await sendWelcomeEmail(payload.email, payload.password);

  return user;
};

export const loginUser = async (payload: LoginDto) => {
  const user = await getUserByEmail(payload.email);
  await verifyUser(user.password, payload.password);
  return generateToken(user);
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
  if (!doesMatch) throw BadRequest("Incorrect email or password");
}

async function generateToken(user: UserDto) {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw InternalServerError("Internal: PRIVATE_KEY not defined");

  const expiresIn = process.env.EXPIRES_IN || "7d";
  return sign({ id: user._id, email: user.email }, privateKey, { expiresIn });
}
