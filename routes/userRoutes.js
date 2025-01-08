import express from "express";
import {
  isAuth,
  loginController,
  logoutController,
  registerController,
  requestPasswordResetController,
  resetPasswordController,
  verifyResetTokenController,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/logout", logoutController);

router.post("/forgot-password", requestPasswordResetController);
router.get("/reset-password/:token", verifyResetTokenController);
router.post("/reset-password", resetPasswordController);

router.get("/verify-token", isAuth);

export default router;
