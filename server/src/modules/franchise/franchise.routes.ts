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

// Admin exclusive franchise routes
router.get("/admin/inquiries", restrictTo("ADMIN"), FranchiseController.getAllInquiries);
router.patch("/admin/inquiries/:id", restrictTo("ADMIN"), FranchiseController.updateInquiry);
router.get("/admin/partners", restrictTo("ADMIN"), FranchiseController.getAllPartners);

export default router;
