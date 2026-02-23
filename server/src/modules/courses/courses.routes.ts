import { Router } from "express";
import { CoursesController } from "./courses.controller";
import { protect } from "../../middlewares/auth";

const router = Router();

router.get("/", CoursesController.getAll);
router.get("/my-courses", protect, CoursesController.getMyCourses);
router.get("/:id", CoursesController.getById);
router.post("/:id/enroll", protect, CoursesController.enroll);

export default router;
