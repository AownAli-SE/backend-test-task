import { Schema, model } from "mongoose";

// Schema definition
const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      minLength: [3, "Category name must have atleast 3 characters"],
      maxLength: [30, "Category name can have maximum 30 characters"],
      match: [/^[A-Za-z\s]+$/, "Only alphabets are allowed"],
    },
    description: {
      type: String,
      maxLength: [1000, "Description can have atmost 1000 characters"],
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Unauthorized request"] },
    cars: [{ type: Schema.Types.ObjectId, ref: "Car" }],
  },
  { timestamps: true }
);

// Creating Category model
export const Category = model("Category", schema);
