import express, { Router } from "express";
import { CoursesController } from "./courses.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

// Non-parameterized routes first to prevent conflicts
router.get("/", CoursesController.getAll);
router.get("/categories", CoursesController.getCategories);
router.get("/my-courses", protect, CoursesController.getMyCourses);

// Parameterized routes after
router.get("/:id/access", protect, CoursesController.checkCourseAccess);
router.get("/:id/verify-payment/:paymentId", protect, CoursesController.verifyPayment);
router.get("/:id/debug-payment/:paymentId", protect, CoursesController.debugPaymentStatus);
router.post("/:id/test-confirm-payment/:paymentId", protect, CoursesController.testConfirmPayment);
router.post("/:id/enroll", protect, CoursesController.enroll);
router.post("/:id/create-payment-intent", protect, CoursesController.createPaymentSession);
router.get("/:id", CoursesController.getById);

// Webhook for stripe
router.post("/webhook/stripe", express.raw({ type: "application/json" }), CoursesController.handleWebhook);

// Admin restricted
router.post("/", protect, restrictTo("ADMIN"), CoursesController.create);
router.patch("/:id", protect, restrictTo("ADMIN"), CoursesController.update);
router.delete("/:id", protect, restrictTo("ADMIN"), CoursesController.delete);

export default router;
