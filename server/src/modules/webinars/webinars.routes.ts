import { Router } from "express";
import { WebinarsController } from "./webinars.controller";
import { protect } from "../../middlewares/auth";

const router = Router();

router.get("/", WebinarsController.getAll);
router.post("/:id", protect, WebinarsController.register);

export default router;
