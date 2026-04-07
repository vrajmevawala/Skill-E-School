import { Router } from "express";
import { BooksController } from "./books.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

router.get("/", BooksController.getAll);
router.get("/:id", BooksController.getById);

router.get("/:id/access", protect, BooksController.checkAccess);
router.post("/:id/purchase", protect, BooksController.purchase);

// Admin only routes
router.post("/", protect, restrictTo("ADMIN"), BooksController.create);
router.patch("/:id", protect, restrictTo("ADMIN"), BooksController.update);
router.delete("/:id", protect, restrictTo("ADMIN"), BooksController.delete);

export default router;
