import { Router } from "express";
import { createCars, deleteCar, getAllCars, getCarById, updateCar } from "../controllers/carController";

const router = Router();

router.get("/", getAllCars).post("/", createCars);
router.get("/:id", getCarById).put("/:id", updateCar).delete("/:id", deleteCar);

export default router;
