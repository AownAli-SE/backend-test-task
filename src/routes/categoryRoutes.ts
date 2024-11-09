import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController";

const router = Router();

router.get("/", getAllCategories).post("/", createCategory);
router.get("/:id", getCategoryById).put("/:id", updateCategory).delete("/:id", deleteCategory);

export default router;
