import Booking from "../models/bookingModel.js";

// Function to validate manual booking ID (8 characters alphanumeric)
const validateManualBookingId = (bookingId) => {
  const manualIdRegex = /^[A-Za-z0-9]{8}$/;
  return manualIdRegex.test(bookingId);
};

/**
 * =====================================================
 * CREATE BOOKING
 * - Public form / Admin manual entry
 * ❌ handler NOT allowed
 * ❌ status NOT allowed
 * ✅ leadSource, instagramHandle, referencePerson allowed
 * ✅ manual bookingId allowed (must be 8 chars alphanumeric)
 * =====================================================
 */
export const createBooking = async (req, res) => {
  try {
    // Remove restricted fields if sent from frontend
    const { handler, status, bookingId, ...data } = req.body;

    // Prepare booking data
    const bookingData = {
      ...data,
      status: "Pending", // force default
    };

    // If bookingId is provided (manual entry), validate it
    if (bookingId) {
      if (!validateManualBookingId(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "Manual booking ID must be exactly 8 characters (letters and numbers only)",
        });
      }
      
      // Check if bookingId already exists
      const existingBooking = await Booking.findOne({ bookingId });
      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: "Booking ID already exists",
        });
      }
      
      bookingData.bookingId = bookingId;
    }

    // Handle conditional fields based on lead source
    if (bookingData.leadSource === "instagram") {
      // Ensure instagramHandle is provided
      if (!bookingData.instagramHandle) {
        return res.status(400).json({
          success: false,
          message: "Instagram handle is required when lead source is Instagram",
        });
      }
      // Clear reference person if set
      bookingData.referencePerson = undefined;
    } else if (bookingData.leadSource === "reference") {
      // Ensure reference person is provided
      if (!bookingData.referencePerson) {
        return res.status(400).json({
          success: false,
          message: "Reference person is required when lead source is Reference",
        });
      }
      // Clear instagram handle if set
      bookingData.instagramHandle = undefined;
    } else {
      // Clear both for other sources
      bookingData.instagramHandle = undefined;
      bookingData.referencePerson = undefined;
    }

    const booking = await Booking.create(bookingData);

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
      .populate("planId", "title pricing")
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      _id: b._id,
      bookingId: b.bookingId,

      // Lead Source
      leadSource: b.leadSource,
      instagramHandle: b.instagramHandle,
      referencePerson: b.referencePerson,

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

      // Plan
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
 * ✔ lead source fields allowed
 * ✔ bookingId can be updated with validation
 * =====================================================
 */
export const updateBooking = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If updating bookingId, validate it
    if (updateData.bookingId) {
      // Check if it's a manual ID (not starting with COID-)
      if (!updateData.bookingId.startsWith('COID-')) {
        if (!validateManualBookingId(updateData.bookingId)) {
          return res.status(400).json({
            success: false,
            message: "Manual booking ID must be exactly 8 characters (letters and numbers only)",
          });
        }
      }
      
      // Check if new bookingId already exists (excluding current booking)
      const existingBooking = await Booking.findOne({ 
        bookingId: updateData.bookingId,
        _id: { $ne: req.params.id }
      });
      
      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: "Booking ID already exists",
        });
      }
    }

    // Handle conditional fields based on lead source
    if (updateData.leadSource === "instagram") {
      // Ensure instagramHandle is provided if lead source is being set to instagram
      if (!updateData.instagramHandle) {
        return res.status(400).json({
          success: false,
          message: "Instagram handle is required when lead source is Instagram",
        });
      }
      // Clear reference person
      updateData.referencePerson = undefined;
    } else if (updateData.leadSource === "reference") {
      // Ensure reference person is provided if lead source is being set to reference
      if (!updateData.referencePerson) {
        return res.status(400).json({
          success: false,
          message: "Reference person is required when lead source is Reference",
        });
      }
      // Clear instagram handle
      updateData.instagramHandle = undefined;
    } else if (updateData.leadSource) {
      // Clear both for other sources
      updateData.instagramHandle = undefined;
      updateData.referencePerson = undefined;
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("serviceId", "title")
     .populate("planId", "title pricing");

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
      
      // Lead Source
      leadSource: booking.leadSource,
      instagramHandle: booking.instagramHandle,
      referencePerson: booking.referencePerson,

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
      
      // Lead Source
      leadSource: booking.leadSource,
      instagramHandle: booking.instagramHandle,
      referencePerson: booking.referencePerson,

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

    const formatted = bookings.map((b) => ({
      _id: b._id,
      bookingId: b.bookingId,
      leadSource: b.leadSource,
      instagramHandle: b.instagramHandle,
      referencePerson: b.referencePerson,
      name: b.name,
      phoneNumber: b.phoneNumber,
      status: b.status,
      createdAt: b.createdAt,
    }));

    res.json({
      success: true,
      count: bookings.length,
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

    const formattedBooking = {
      _id: booking._id,
      bookingId: booking.bookingId,
      leadSource: booking.leadSource,
      instagramHandle: booking.instagramHandle,
      referencePerson: booking.referencePerson,
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
 * GET BOOKINGS BY LEAD SOURCE (ADMIN)
 * - Filter bookings by Instagram, Reference, or Other
 * =====================================================
 */
export const getBookingsByLeadSource = async (req, res) => {
  try {
    const { source } = req.params;
    
    if (!["instagram", "reference", "other"].includes(source)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead source. Must be instagram, reference, or other",
      });
    }

    const query = source === "other" 
      ? { leadSource: { $nin: ["instagram", "reference"] } }
      : { leadSource: source };

    const bookings = await Booking.find(query)
      .populate("serviceId", "title")
      .populate("planId", "title pricing")
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      _id: b._id,
      bookingId: b.bookingId,
      leadSource: b.leadSource,
      instagramHandle: b.instagramHandle,
      referencePerson: b.referencePerson,
      name: b.name,
      phoneNumber: b.phoneNumber,
      status: b.status,
      createdAt: b.createdAt,
    }));

    res.json({
      success: true,
      count: bookings.length,
      source,
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
 * BULK UPDATE STATUS (ADMIN)
 * - Update status for multiple bookings at once
 * =====================================================
 */
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { bookingIds, status } = req.body;

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Booking IDs array is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await Booking.updateMany(
      { _id: { $in: bookingIds } },
      { status },
      { runValidators: true }
    );

    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} bookings successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};