import { Router } from "express";
import { ConsultancyController } from "./consultancy.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

router.get("/experts", ConsultancyController.getAllExperts);
router.post("/book", protect, ConsultancyController.book);
router.get("/access", protect, ConsultancyController.getAccess);
router.get("/my-bookings", protect, ConsultancyController.getMyBookings);
router.get("/gcal-bookings", protect, ConsultancyController.getMyGCalBookings);
router.post("/gcal-bookings", protect, ConsultancyController.createGCalBooking);
router.get("/experts/:id/link", protect, ConsultancyController.getCalendarLink);
router.post("/experts/:id/purchase", protect, ConsultancyController.purchase); // Legacy/Simulation
router.post("/experts/:id/create-payment-intent", protect, ConsultancyController.createPaymentIntent);
router.get("/experts/:id/verify-payment/:paymentId", protect, ConsultancyController.verifyPayment);
router.get("/experts/:id/sync", protect, ConsultancyController.syncExpertBookings);

// Google Calendar OAuth
router.get("/google/auth", protect, ConsultancyController.getGoogleAuthUrl);
router.get("/google/callback", ConsultancyController.handleGoogleCallback);

// Admin routes
router.get("/admin/experts", protect, restrictTo("ADMIN"), ConsultancyController.getAdminExperts);
router.post("/experts", protect, restrictTo("ADMIN"), ConsultancyController.createExpert);
router.patch("/experts/:id", protect, restrictTo("ADMIN"), ConsultancyController.updateExpert);
router.delete("/experts/:id", protect, restrictTo("ADMIN"), ConsultancyController.deleteExpert);

export default router;
