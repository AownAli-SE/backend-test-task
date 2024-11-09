import { NextFunction, Request, Response } from "express";
import { catchError } from "../utilities/catchError";
import { addNewcar, deleteCarById, getCar, getCars, updateCarById } from "../services/carService";

export const getAllCars = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const result = await getCars();
  res.success(200, "Cars fetched successfully", result[0]);
});

export const getCarById = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const car = await getCar(req.params.id);
  res.success(200, "Car fetched successfully", car);
});

export const createCars = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const car = await addNewcar(req.body, req.user);
  res.success(201, "Car added successfully", car);
});

export const updateCar = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, ...payload } = req.body || {};
  const car = await updateCarById(payload, req.params.id);
  res.success(200, "Car updated successfully", car);
});

export const deleteCar = catchError(async (req: Request, res: Response, next: NextFunction) => {
  await deleteCarById(req.params.id);
  res.success(204, "Car deleted successfully", null);
});
