import { Schema, model } from "mongoose";
import { hash } from "argon2";
import { BadRequest, InternalServerError } from "http-errors";
import { logInfo } from "../services/loggingService";
import { UserDto } from "../dtos/signupDto";

// Defining user schema
const schema = new Schema<UserDto>(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is required"],
      trim: true,
      minLength: [2, "Firstname must have atleast 2 characters"],
      maxLength: [20, "Firstname can have atmost 20 characters"],
      match: [/^[A-Za-z\s]+$/, "Only alphabets are allowed"],
    },
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
      trim: true,
      minLength: [2, "Lastname must have atleast 2 characters"],
      maxLength: [20, "Lastname can have atmost 20 characters"],
      match: [/^[A-Za-z\s]+$/, "Only alphabets are allowed"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: [6, "Password must have atleast 6 characters"],
      maxLength: [20, "Password can have atmost 20 characters"],
      match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_-]).{8,}$/, "Password is not strong enough"],
    },
    profileImage: {
      type: String,
      required: false,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      min: [new Date("1900-01-01"), "Please enter a valid date of birth"],
      max: [new Date().setFullYear(new Date().getFullYear() - 18), "You must be 18 years old to create account"],
      set: (dob: string) => new Date(dob).toISOString(),
    },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    cars: [{ type: Schema.Types.ObjectId, ref: "Car" }],
  },
  { timestamps: true }
);

// Pre-save hook: Hashing password before saving document to database
schema.pre("save", async function (next) {
  try {
    // Checking for email existence
    const user = await this.model("User").findOne({ email: this.email });
    if (user) throw BadRequest("Email already registered");

    // Hashing password
    const key = process.env.HASH_KEY;
    if (!key) throw InternalServerError("Hash key not defined");

    const secret = Buffer.from(key);
    this.password = await hash(this.password, { secret });
    next();
  } catch (err: any) {
    next(err);
  }
});

// Post-save hook: logging success response
schema.post("save", function (doc, next) {
  logInfo("User record added to database successfully", doc);
  next();
});

// Creating User model
export const User = model("User", schema);
