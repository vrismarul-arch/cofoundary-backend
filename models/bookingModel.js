import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
    },

    name: {
      type: String,
      required: true,
    },

    businessName: {
      type: String,
    },

    designation: {
      type: String,
    },

    kindOfBusiness: {
      type: String,
    },

    businessNature: {
      type: String,
    },

    businessType: {
      type: String,
      enum: ["existing", "new"],
      required: true,
    },

    gstNumber: {
      type: String,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    mailId: {
      type: String,
    },

    currentAddress: {
      type: String,
    },

    // ✅ Handler exists BUT NOT SET DURING CREATE
    handler: {
      type: String,
      enum: ["Sharukh", "Feroze", "Vijay","Abdul"],
      default: null,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
