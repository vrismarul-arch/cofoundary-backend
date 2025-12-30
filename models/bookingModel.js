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
    startTime: String,

    name: {
      type: String,
      required: true,
    },

    businessName: String,
    designation: String,
    kindOfBusiness: String,
    businessNature: String,

    businessType: {
      type: String,
      enum: ["existing", "new"],
      required: true,
    },

    gstNumber: String,

    phoneNumber: {
      type: String,
      required: true,
    },

    mailId: String,
    currentAddress: String,

    // ✅ handler EXISTS but is OPTIONAL
    handler: {
      type: String,
      enum: ["Sharukh", "Feroze", "Vijay", "Abdul"],
      required: false,          // IMPORTANT
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
