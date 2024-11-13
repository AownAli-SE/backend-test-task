import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  changePassword,
  forgetPassword,
  getBasicUserDetails,
  login,
  signup,
  updateBasicInfo,
} from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.get("/me", authMiddleware, getBasicUserDetails);
router.put("/me/update", authMiddleware, updateBasicInfo);

export default router;
