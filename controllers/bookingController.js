import Booking from "../models/bookingModel.js";

/**
 * =====================================================
 * CREATE BOOKING
 * - Public form
 * - Admin manual entry
 * ❌ handler NOT allowed here
 * =====================================================
 */
export const createBooking = async (req, res) => {
  try {
    const { handler, status, ...data } = req.body;

    const booking = await Booking.create({
      ...data,
      status: "Pending",   // force
      handler: null,       // block handler on create
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
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
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      _id: b._id,

      // User
      name: b.name,
      phoneNumber: b.phoneNumber,
      mailId: b.mailId,

      // Business
      businessType: b.businessType,
      gstNumber: b.gstNumber,
      businessName: b.businessName,
      designation: b.designation,
      kindOfBusiness: b.kindOfBusiness,
      businessNature: b.businessNature,
      currentAddress: b.currentAddress,

      // Service
      service: b.serviceId?.title,
      serviceId: b.serviceId,

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
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking updated successfully",
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
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated",
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
