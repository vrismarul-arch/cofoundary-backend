import Booking from "../models/bookingModel.js";

// Create Booking (Public Form)
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({
      success: true,
      message: "Booking Request Submitted",
      booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Bookings (Admin Panel)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceId", "title")
      .populate("planId", "title pricing");

    const formatted = bookings.map((b) => ({
      _id: b._id,
      name: b.name,
      businessName: b.businessName,
      designation: b.designation,
      kindOfBusiness: b.kindOfBusiness,
      businessNature: b.businessNature,
      businessAlreadyExists: b.businessAlreadyExists,
      gstRegistered: b.gstRegistered,
      phoneNumber: b.phoneNumber,
      mailId: b.mailId,
      currentAddress: b.currentAddress,
      service: b.serviceId?.title,
      plan: b.planId?.title,
      pricing: b.planId?.pricing,
      status: b.status,
      createdAt: b.createdAt,
    }));

    res.json({ success: true, bookings: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Admin — Update Booking Status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ success: false, message: "Status required" });

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking)
      return res.status(404).json({ success: false, message: "Not Found" });

    res.json({
      success: true,
      message: "Status Updated",
      booking,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
