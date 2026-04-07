import { Router } from "express";
import { ConsultancyController } from "./consultancy.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

router.get("/experts", ConsultancyController.getAllExperts);
router.post("/book", protect, ConsultancyController.book);

// Admin routes
router.post("/experts", protect, restrictTo("ADMIN"), ConsultancyController.createExpert);
router.patch("/experts/:id", protect, restrictTo("ADMIN"), ConsultancyController.updateExpert);
router.delete("/experts/:id", protect, restrictTo("ADMIN"), ConsultancyController.deleteExpert);

export default router;
