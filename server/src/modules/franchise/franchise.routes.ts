import { Router } from "express";
import { FranchiseController } from "./franchise.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

// Public inquiry
router.post("/inquiry", FranchiseController.createInquiry);

// Partner restricted routes
router.use(protect, restrictTo("FRANCHISE_PARTNER", "ADMIN"));
router.get("/dashboard", FranchiseController.getDashboard);
router.get("/leads", FranchiseController.getLeads);
router.get("/payouts", FranchiseController.getPayouts);

export default router;
