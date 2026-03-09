// controllers/bookingController.js
import Booking from "../models/bookingModel.js";

/**
 * =====================================================
 * CREATE BOOKING
 * - Public form / Admin manual entry
 * ❌ handler NOT allowed
 * ❌ status NOT allowed
 * =====================================================
 */
export const createBooking = async (req, res) => {
  try {
    // Remove restricted fields if sent from frontend
    const { handler, status, ...data } = req.body;

    const booking = await Booking.create({
      ...data,
      status: "Pending", // force default
      // ❌ DO NOT set handler here
    });

    // Populate the response
    const populatedBooking = await Booking.findById(booking._id)
      .populate("serviceId", "title")
      .populate("planId", "title pricing");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * =====================================================
 * GET ALL BOOKINGS (ADMIN)
 * =====================================================
 */
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceId", "title")
      .populate("planId", "title pricing") // Populate plan data
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      _id: b._id,
      bookingId: b.bookingId, // Include custom booking ID

      // User
      name: b.name,
      phoneNumber: b.phoneNumber,
      mailId: b.mailId,

      // Business
      businessType: b.businessType,
      businessName: b.businessName,
      designation: b.designation,
      kindOfBusiness: b.kindOfBusiness,
      businessNature: b.businessNature,
      gstNumber: b.gstNumber,
      currentAddress: b.currentAddress,

      // Service
      service: b.serviceId?.title,
      serviceId: b.serviceId,

      // Plan - NEW
      planId: b.planId,
      planTitle: b.planTitle || b.planId?.title,
      pricing: b.pricing || b.planId?.pricing,

      // Schedule
      startDate: b.startDate,
      startTime: b.startTime,

      // Admin
      handler: b.handler,
      status: b.status,

      createdAt: b.createdAt,
    }));

    res.json({
      success: true,
      bookings: formatted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * UPDATE BOOKING (ADMIN)
 * ✔ handler allowed
 * ✔ full edit
 * =====================================================
 */
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("serviceId", "title")
     .populate("planId", "title pricing"); // Populate after update

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Format the response
    const formattedBooking = {
      _id: booking._id,
      bookingId: booking.bookingId,
      name: booking.name,
      phoneNumber: booking.phoneNumber,
      mailId: booking.mailId,
      businessType: booking.businessType,
      businessName: booking.businessName,
      designation: booking.designation,
      kindOfBusiness: booking.kindOfBusiness,
      businessNature: booking.businessNature,
      gstNumber: booking.gstNumber,
      currentAddress: booking.currentAddress,
      service: booking.serviceId?.title,
      serviceId: booking.serviceId,
      planId: booking.planId,
      planTitle: booking.planTitle || booking.planId?.title,
      pricing: booking.pricing || booking.planId?.pricing,
      startDate: booking.startDate,
      startTime: booking.startTime,
      handler: booking.handler,
      status: booking.status,
      createdAt: booking.createdAt,
    };

    res.json({
      success: true,
      message: "Booking updated successfully",
      booking: formattedBooking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * UPDATE STATUS ONLY (ADMIN)
 * =====================================================
 */
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("serviceId", "title")
     .populate("planId", "title pricing");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * DELETE BOOKING (ADMIN)
 * =====================================================
 */
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * GET SINGLE BOOKING (ADMIN)
 * =====================================================
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("serviceId", "title")
      .populate("planId", "title pricing");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const formattedBooking = {
      _id: booking._id,
      bookingId: booking.bookingId,
      name: booking.name,
      phoneNumber: booking.phoneNumber,
      mailId: booking.mailId,
      businessType: booking.businessType,
      businessName: booking.businessName,
      designation: booking.designation,
      kindOfBusiness: booking.kindOfBusiness,
      businessNature: booking.businessNature,
      gstNumber: booking.gstNumber,
      currentAddress: booking.currentAddress,
      service: booking.serviceId?.title,
      serviceId: booking.serviceId,
      planId: booking.planId,
      planTitle: booking.planTitle || booking.planId?.title,
      pricing: booking.pricing || booking.planId?.pricing,
      startDate: booking.startDate,
      startTime: booking.startTime,
      handler: booking.handler,
      status: booking.status,
      createdAt: booking.createdAt,
    };

    res.json({
      success: true,
      booking: formattedBooking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * GET BOOKINGS BY PLAN (ADMIN)
 * =====================================================
 */
export const getBookingsByPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    
    const bookings = await Booking.find({ planId })
      .populate("serviceId", "title")
      .populate("planId", "title pricing")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * GET BOOKING BY BOOKING ID (ADMIN)
 * =====================================================
 */
export const getBookingByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findOne({ bookingId })
      .populate("serviceId", "title")
      .populate("planId", "title pricing");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};