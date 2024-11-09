import { NotFound } from "http-errors";

import { Category } from "../models/categoryModel";
import { CreateOrUpdateCategoryDto } from "../dtos/categoryDto";
import { UserJWTPayloadDto } from "../dtos/userDtos";

export const getCategories = () => {
  return Category.aggregate([
    { $match: {} },
    // {
    //   $lookup: {
    //     from: "Car",
    //     localField: "_id",
    //     foreignField: "categoryId",
    //     as: "cars",
    //   },
    // },
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

export const getCategory = async (id: string) => {
  const query = Category.findById(id).populate("cars");
  const category = await query;
  if (!category) throw NotFound(`Category with id ${id} does not exist`);
  return category;
};

export const addNewCategory = async (payload: CreateOrUpdateCategoryDto, user: UserJWTPayloadDto) => {
  const createCategoryData = { ...payload, userId: user.id };
  return Category.create(createCategoryData);
};

export const updateCategoryById = async (payload: CreateOrUpdateCategoryDto, categoryId: string) => {
  const updatedRecord = await Category.findByIdAndUpdate(categoryId, payload, { new: true, runValidators: true });
  if (!updatedRecord) throw NotFound(`Category with id ${categoryId} does not exist`);
  return updatedRecord;
};

export const deleteCategoryById = async (categoryId: string) => {
  const deletedRecord = await Category.findByIdAndDelete(categoryId);
  if (!deletedRecord) throw NotFound(`Category with id ${categoryId} not found or already deleted`);
};
