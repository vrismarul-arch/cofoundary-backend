import mongoose from "mongoose";

const comboSchema = new mongoose.Schema({
  title: String,
  pricingInfo: String,
  features: [String],
});

const serviceSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    pricing: String,
    combos: [comboSchema],
  },
  { timestamps: true }
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
