import { NotFound } from "http-errors";

import { UserJWTPayloadDto } from "../dtos/userDtos";
import { Car } from "../models/carModel";
import { CreateOrUpdateCarDto } from "../dtos/carDto";
import { Category } from "../models/categoryModel";

export const getCars = () => {
  return Car.aggregate([
    { $match: {} },
    {
      $facet: {
        totalCount: [{ $count: "total" }],
        cars: [{ $skip: 0 }, { $limit: 10 }],
      },
    },
    { $unwind: "$totalCount" },
    {
      $project: {
        totalCount: "$totalCount.total",
        cars: 1,
      },
    },
  ]);
};

export const getCar = async (id: string) => {
  const car = await Car.findById(id).populate("categoryId");
  if (!car) throw NotFound(`Car with id ${id} does not exist`);
  return car;
};

export const addNewcar = async (payload: CreateOrUpdateCarDto, user: UserJWTPayloadDto) => {
  const createCarData = { ...payload, userId: user.id };
  const car = await Car.create(createCarData);

  const category = await Category.findById(payload.categoryId);
  category?.cars.push(car._id);
  await category?.save();
  return car;
};

export const updateCarById = async (payload: CreateOrUpdateCarDto, carId: string) => {
  const updatedRecord = await Car.findByIdAndUpdate(carId, payload, { new: true, runValidators: true });
  if (!updatedRecord) throw NotFound(`Car with id ${carId} does not exist`);
  return updatedRecord;
};

export const deleteCarById = async (carId: string) => {
  const deletedRecord = await Car.findByIdAndDelete(carId);
  if (!deletedRecord) throw NotFound(`Car with id ${carId} not found or already deleted`);
};
