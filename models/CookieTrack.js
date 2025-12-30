import mongoose from "mongoose";

const cookieTrackSchema = new mongoose.Schema(
  {
    cookie_id: { type: String, required: true },
    accepted: { type: Boolean, required: true },

    browser: String,
    os: String,
    device_type: String,
    user_agent: String,
    language: String,
    screen_resolution: String,

    referrer: String,
    site_page: String,
    ip: String,
  },
  { timestamps: true }
);

export default mongoose.model("CookieTrack", cookieTrackSchema);
  