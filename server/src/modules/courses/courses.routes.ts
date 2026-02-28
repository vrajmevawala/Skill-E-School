import { Router } from "express";
import { CoursesController } from "./courses.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

router.get("/", CoursesController.getAll);
router.get("/categories", CoursesController.getCategories);
router.get("/my-courses", protect, CoursesController.getMyCourses);
router.get("/:id", CoursesController.getById);
router.post("/:id/enroll", protect, CoursesController.enroll);

// Admin restricted
router.post("/", protect, restrictTo("ADMIN"), CoursesController.create);
router.patch("/:id", protect, restrictTo("ADMIN"), CoursesController.update);
router.delete("/:id", protect, restrictTo("ADMIN"), CoursesController.delete);

export default router;
