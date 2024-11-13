import { Schema } from "mongoose";

export interface UserDto {
  _id: Schema.Types.ObjectId;
  firstname: string;
  lastname: string;
  dateOfBirth: string | Date;
  email: string;
  password: string;
  categories: any;
  cars: any;
}
