import { Router } from "express";
import { AuthController } from "./auth.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

router.post("/register", AuthController.register);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", protect, AuthController.getMe);

// Admin restricted
router.get("/users", protect, restrictTo("ADMIN"), AuthController.getAll);
router.patch("/users/:id", protect, restrictTo("ADMIN"), AuthController.update);
router.delete("/users/:id", protect, restrictTo("ADMIN"), AuthController.delete);

export default router;
