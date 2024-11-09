import { NotFound } from "http-errors";

import { UserJWTPayloadDto } from "../dtos/userDtos";
import { Car } from "../models/carModel";
import { CreateOrUpdateCarDto } from "../dtos/carDto";

export const getCategories = () => {
  return Car.aggregate([
    { $match: {} },
    {
      $facet: {
        totalCount: [{ $count: "total" }],
        categories: [{ $skip: 0 }, { $limit: 10 }],
      },
    },
    { $unwind: "$totalCount" },
    {
      $project: {
        totalCount: "$totalCount.total",
        categories: 1,
      },
    },
  ]);
};

export const getCar = async (id: string) => {
  const car = await Car.findById(id);
  if (!car) throw NotFound(`Car with id ${id} does not exist`);
  return car;
};

export const addNewcar = async (payload: CreateOrUpdateCarDto, user: UserJWTPayloadDto) => {
  const createCarData = { ...payload, userId: user.id };
  return Car.create(createCarData);
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
