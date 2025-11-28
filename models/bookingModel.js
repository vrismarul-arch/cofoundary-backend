import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    name: { type: String},
    businessName: { type: String},
    designation: { type: String},
    kindOfBusiness: { type: String},
    businessNature: { type: String},
    businessAlreadyExists: { type: Boolean},
    gstRegistered: { type: Boolean},
    phoneNumber: { type: String},
    mailId: { type: String},
    currentAddress: { type: String},

    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
