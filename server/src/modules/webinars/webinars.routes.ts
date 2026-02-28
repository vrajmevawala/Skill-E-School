import { Router } from "express";
import { WebinarsController } from "./webinars.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

router.get("/", WebinarsController.getAll);
router.post("/register/:id", protect, WebinarsController.register);

// Admin restricted
router.post("/", protect, restrictTo("ADMIN"), WebinarsController.create);
router.patch("/:id", protect, restrictTo("ADMIN"), WebinarsController.update);
router.delete("/:id", protect, restrictTo("ADMIN"), WebinarsController.delete);

export default router;
