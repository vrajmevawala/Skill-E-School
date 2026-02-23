import { Router } from "express";
import { AuthController } from "./auth.controller";
import { protect } from "../../middlewares/auth";

const router = Router();

router.post("/register", AuthController.register);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", protect, AuthController.getMe);

export default router;
