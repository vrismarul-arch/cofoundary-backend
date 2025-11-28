import express from "express";
import { createBooking, getBookings, updateStatus } from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public - User submits booking
router.post("/", createBooking);

// Admin - View all bookings
router.get("/admin/bookings", protect,  getBookings);

// Admin - Update booking status
router.put("/admin/bookings/:id", protect,  updateStatus);

export default router;
