import { NotFound } from "http-errors";

import { UserJWTPayloadDto } from "../dtos/userDtos";
import { Car } from "../models/carModel";
import { CreateOrUpdateCarDto } from "../dtos/carDto";
import { Category } from "../models/categoryModel";
import { User } from "../models/userModel";
import { Types } from "mongoose";

// Get all cars
export const getCars = (userId: string, currentPage: number, pageLimit: number, selfCreated: boolean) => {
  return Car.aggregate([
    // Filter stage
    {
      $match: selfCreated
        ? {
            $expr: {
              $eq: [{ $toString: "$userId" }, userId],
            },
          }
        : {},
    },
    // User populating stage
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { firstname: 1, lastname: 1, isMyCar: { $eq: [{ $toString: "$_id" }, userId] } } }],
      },
    },
    // Flattening the returned array from previous stage
    { $unwind: "$user" },
    {
      $facet: {
        totalCount: [{ $count: "total" }],
        cars: [{ $skip: (currentPage - 1) * pageLimit }, { $limit: pageLimit }],
      },
    },
    { $unwind: "$totalCount" },
    // Selecting fields to return from this pipeline
    {
      $project: {
        totalCount: "$totalCount.total",
        cars: 1,
      },
    },
  ]);
};

// Get car by id
export const getCar = async (id: string) => {
  const car = await Car.findById(id).populate("categoryId");
  if (!car) throw NotFound(`Car with id ${id} does not exist`);
  return car;
};

// Add new car
export const addNewcar = async (payload: CreateOrUpdateCarDto, user: UserJWTPayloadDto) => {
  const createCarData = { ...payload, userId: user.id };
  const car = await Car.create(createCarData);

  const category = await Category.findById(payload.categoryId);
  category?.cars.push(car._id);
  await category?.save();

  const userDoc = await User.findById(user.id);
  userDoc?.cars.push(car._id);
  await userDoc?.save();

  return car;
};

// Update car by id
export const updateCarById = async (payload: CreateOrUpdateCarDto, carId: string) => {
  const updatedRecord = await Car.findByIdAndUpdate(carId, payload, { new: true, runValidators: true });
  if (!updatedRecord) throw NotFound(`Car with id ${carId} does not exist`);
  return updatedRecord;
};

// Delete car by id
export const deleteCarById = async (carId: string) => {
  const deletedRecord = await Car.findByIdAndDelete(carId);

  if (deletedRecord) {
    const category = await Category.findById(deletedRecord.categoryId);
    category!.cars = category!.cars.filter((car) => car.toString() !== deletedRecord._id.toString());
    await category?.save();

    const userDoc = await User.findById(deletedRecord.userId);
    userDoc!.cars = userDoc!.cars.filter((car: Types.ObjectId) => car.toString() !== deletedRecord._id.toString());
    await userDoc?.save();
  }

  if (!deletedRecord) throw NotFound(`Car with id ${carId} not found or already deleted`);
};
