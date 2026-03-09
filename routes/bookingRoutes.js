// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  getBookingByBookingId,
  getBookingsByPlan,
  updateBooking,
  updateStatus,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// Public route (no auth required for creating booking)
router.post("/", createBooking);

// Admin routes (add your auth middleware as needed)
router.get("/admin/bookings", getBookings);
router.get("/admin/bookings/id/:id", getBookingById);
router.get("/admin/bookings/bookingId/:bookingId", getBookingByBookingId); // Search by custom booking ID
router.get("/admin/bookings/plan/:planId", getBookingsByPlan);
router.put("/admin/bookings/:id", updateBooking);
router.patch("/admin/bookings/:id/status", updateStatus);
router.delete("/admin/bookings/:id", deleteBooking);

export default router;