import { NextFunction, Request, Response } from "express";
import { catchError } from "../utilities/catchError";
import { addNewcar, deleteCarById, getCar, getCars, updateCarById } from "../services/carService";

// Get all cars route handler
export const getAllCars = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, selfCreated } = req.query as { page: string; limit: string; selfCreated: string };
  const currentPage = page && !isNaN(parseInt(page)) ? parseInt(page) : 1;
  const pageLimit = limit && !isNaN(parseInt(limit)) ? parseInt(limit) : 10;
  const isSelfCreated = !!selfCreated;

  const result = await getCars(req.user.id, currentPage, pageLimit, isSelfCreated);
  const responseData = {
    cars: result.length ? result[0].cars : [],
    totalCount: result.length ? result[0].totalCount : 0,
    page: currentPage,
    pageSize: pageLimit,
  };
  res.success(200, "Categories fetched successfully", responseData);
});

// Get car by id route handler
export const getCarById = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const car = await getCar(req.params.id);
  res.success(200, "Car fetched successfully", car);
});

// Post new car route handler
export const createCars = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const car = await addNewcar(req.body, req.user);
  res.success(201, "Car added successfully", car);
});

// Update car by id route handler
export const updateCar = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, ...payload } = req.body || {};
  const car = await updateCarById(payload, req.params.id);
  res.success(200, "Car updated successfully", car);
});

// Delete car by id route handler
export const deleteCar = catchError(async (req: Request, res: Response, next: NextFunction) => {
  await deleteCarById(req.params.id);
  res.success(204, "Car deleted successfully", null);
});
