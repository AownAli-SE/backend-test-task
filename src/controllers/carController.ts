import { NextFunction, Request, Response } from "express";
import { NotFound } from "http-errors";
import { catchError } from "../utilities/catchError";
import { Car } from "../models/carModel";

export const getAllCars = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const result = await Car.aggregate([
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

  res.success(200, "Cars fetched successfully", result[0]);
});

export const getCarById = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw NotFound(`Car with id ${req.params.id} does not exist`);

  res.success(200, "Car fetched successfully", car);
});

export const createCars = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const payload = { ...(req.body || {}), userId: user.id };
  const car = await Car.create(payload);
  res.success(201, "Car added successfully", car);
});

export const updateCar = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, ...payload } = req.body;
  const updatedRecord = await Car.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });

  if (!updatedRecord) throw NotFound(`Car with id ${req.params.id} does not exist`);

  res.success(200, "Car updated successfully", updatedRecord);
});

export const deleteCar = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const deletedRecord = await Car.findByIdAndDelete(req.params.id);

  if (!deletedRecord) throw NotFound(`Car with id ${req.params.id} not found or already deleted`);

  res.success(204, "Car deleted successfully", null);
});
