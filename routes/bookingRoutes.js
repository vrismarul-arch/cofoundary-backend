import express from "express";
import {
  createBooking,
  getBookings,
  updateStatus,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public / Manual Admin
router.post("/", createBooking);

// Admin
router.get("/admin/bookings", protect, getBookings);
router.put("/admin/bookings/:id/status", protect, updateStatus);
router.put("/admin/bookings/:id", protect, updateBooking);
router.delete("/admin/bookings/:id", protect, deleteBooking);

export default router;
