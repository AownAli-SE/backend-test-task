import { Schema, model } from "mongoose";
import { logInfo } from "../services/loggingService";

// Defining car schema
const schema = new Schema(
  {
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
      minLength: [3, "Model must have atleast 3 characters"],
      maxLength: [30, "Model must have atleast 30 characters"],
      match: [/^[A-Za-z0-9-\s]+$/, "Only alphabets, numbers and '-' are allowed"],
    },
    make: {
      type: String,
      required: [true, "Make is required"],
      trim: true,
      minLength: [3, "Make must have atleast 3 characters"],
      maxLength: [30, "Make must have atleast 30 characters"],
      match: [/^[A-Za-z\s]+$/, "Only alphabets are allowed"],
    },
    releasedYear: {
      type: Number,
      required: [true, "Car released year is required"],
      min: [1970, "Only cars released after 1970 can be posted"],
      max: [new Date().getFullYear(), "Invalid release year"],
      validate: {
        validator: Number.isInteger,
        message: "Invalid release year",
      },
    },
    description: {
      type: String,
      maxLength: [1000, "Description can have atmost 1000 characters"],
      trim: true,
    },
    transmission: {
      type: String,
      required: [true, "Transmission type is required"],
      enum: {
        values: ["Manual", "Hybrid", "Automatic", "Electric"],
        message: "Please choose from 'Manual', 'Hybrid', 'Automatic', 'Electric'",
      },
    },
    seatCapacity: {
      type: Number,
      required: [true, "Seats capacity is required"],
      min: [2, "Seat capacity should be greater then 1"],
      max: [60, "Seats capacity should be less then 61"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
      match: [/^[A-Za-z\s]+$/, "Only alphabets are allowed"],
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      trim: true,
      match: [/^[A-Za-z0-9-\s]+$/, "Only alphabets, numbers and '-' are allowed"],
    },

    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Post-save hook: Logging success response
schema.post("save", function (doc, next) {
  logInfo("Car record added successfully", doc);
  next();
});

// Creating Car model
export const Car = model("Car", schema);
