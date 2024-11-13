import { NotFound } from "http-errors";

import { Category } from "../models/categoryModel";
import { CreateOrUpdateCategoryDto } from "../dtos/categoryDto";
import { UserJWTPayloadDto } from "../dtos/userDtos";
import { User } from "../models/userModel";
import { Car } from "../models/carModel";

// Get all categories
export const getCategories = (userId: string, currentPage: number, pageLimit: number, selfCreated: boolean) => {
  return Category.aggregate([
    // Filtering stage
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
        pipeline: [{ $project: { firstname: 1, lastname: 1, isMyCategory: { $eq: [{ $toString: "$_id" }, userId] } } }],
      },
    },
    // Flattening array return from previous stage
    { $unwind: "$user" },
    {
      $facet: {
        totalCount: [{ $count: "total" }],
        categories: [{ $skip: (currentPage - 1) * pageLimit }, { $limit: pageLimit }],
      },
    },
    { $unwind: "$totalCount" },
    // Selecting fields to return
    {
      $project: {
        totalCount: "$totalCount.total",
        categories: 1,
      },
    },
  ]);
};

// Get category by id
export const getCategory = async (id: string) => {
  const query = Category.findById(id).populate("cars");
  const category = await query;
  if (!category) throw NotFound(`Category with id ${id} does not exist`);
  return category;
};

// Add new category
export const addNewCategory = async (payload: CreateOrUpdateCategoryDto, user: UserJWTPayloadDto) => {
  const data: CreateOrUpdateCategoryDto = {
    name: payload.name,
    description: payload.description,
  };

  const createCategoryData = { ...data, userId: user.id };
  const category = await Category.create(createCategoryData);

  const userRecord = await User.findById(user.id);
  userRecord?.categories.push(category._id);
  await userRecord?.save();

  return category;
};

// Update category by id
export const updateCategoryById = async (payload: CreateOrUpdateCategoryDto, categoryId: string) => {
  const data: CreateOrUpdateCategoryDto = {
    name: payload.name,
    description: payload.description,
  };

  const updatedRecord = await Category.findByIdAndUpdate(categoryId, data, { new: true, runValidators: true });
  if (!updatedRecord) throw NotFound(`Category with id ${categoryId} does not exist`);
  return updatedRecord;
};

// Delete category by id
export const deleteCategoryById = async (categoryId: string, userId: string) => {
  const deletedRecord = await Category.findByIdAndDelete(categoryId);

  if (deletedRecord) {
    const userRecord = await User.findById(userId);
    userRecord!.categories = userRecord?.categories.filter((id: string) => id !== categoryId);
    await userRecord?.save();

    await Car.deleteMany({ categoryId: categoryId });
  }

  if (!deletedRecord) throw NotFound(`Category with id ${categoryId} not found or already deleted`);
};
