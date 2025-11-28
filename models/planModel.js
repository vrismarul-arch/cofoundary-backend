import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pricing: { type: String, required: true },
    features: [String],
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    serviceName: String,
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
