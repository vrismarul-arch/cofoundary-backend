import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Custom booking ID (auto-generated: COID-001 or manual: 8 char alphanumeric)
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },

    // Lead Type fields
    leadSource: {
      type: String,
      enum: ["instagram", "reference", "other"],
      default: "other",
    },
    instagramHandle: {
      type: String,
      trim: true,
    },
    referencePerson: {
      type: String,
      trim: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },

    planTitle: String,
    pricing: String,

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

    handler: {
      type: String,
      enum: ["Sharukh", "Feroze", "Vijay", "Abdul"],
      required: false,
    },

    status: {
      type: String,
      enum: [
        "Pending", 
        "Confirmed", 
        "Docs Yet to receive", 
        "Draft Sent", 
        "Signed", 
        "Invoiced",
        "Approved", 
        "Cancelled"
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate custom booking ID only if not provided
bookingSchema.pre('save', async function(next) {
  if (this.isNew && !this.bookingId) {
    try {
      // Find the last booking to get the latest bookingId
      const lastBooking = await this.constructor.findOne(
        { bookingId: { $regex: '^COID-' } }, // Only look for COID format
        { bookingId: 1 }, 
        { sort: { bookingId: -1 } }
      );

      let nextNumber = 1;
      
      if (lastBooking && lastBooking.bookingId) {
        // Extract number from last bookingId (e.g., COID-001 -> 1)
        const lastNumber = parseInt(lastBooking.bookingId.split('-')[1]);
        nextNumber = lastNumber + 1;
      }

      // Format new bookingId (pad with zeros to 3 digits)
      this.bookingId = `COID-${nextNumber.toString().padStart(3, '0')}`;
      
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export default mongoose.model("Booking", bookingSchema);