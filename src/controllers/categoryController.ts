import { NextFunction, Request, Response } from "express";
import { catchError } from "../utilities/catchError";
import {
  addNewCategory,
  deleteCategoryById,
  getCategories,
  getCategory,
  updateCategoryById,
} from "../services/categoryService";

// get all categories route handler
export const getAllCategories = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const result = await getCategories();
  res.success(200, "Categories fetched successfully", result[0]);
});

// get category by id route handler
export const getCategoryById = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const category = await getCategory(req.params.id);
  res.success(200, "Category fetched successfully", category);
});

// post new category route handler
export const createCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const category = await addNewCategory(req.body, req.user);
  res.success(201, "Category added successfully", category);
});

// update category by id route handler
export const updateCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, ...payload } = req.body || {};
  const category = await updateCategoryById(payload, req.params.id);
  res.success(200, "Category updated successfully", category);
});

// delete category by id route handler
export const deleteCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
  await deleteCategoryById(req.params.id);
  res.success(204, "Category deleted successfully", null);
});
