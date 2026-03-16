import { Router } from "express";
import { ConsultancyController } from "./consultancy.controller";
import { protect } from "../../middlewares/auth";

const router = Router();

router.get("/experts", ConsultancyController.getAllExperts);
router.post("/book", protect, ConsultancyController.book);

export default router;
