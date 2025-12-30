import CookieTrack from "../models/CookieTrack.js";

export const trackCookie = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const entry = await CookieTrack.create({
      cookie_id: req.body.cookie_id,
      accepted: Boolean(req.body.accepted), // ✅ FORCE BOOLEAN
      browser: req.body.browser || "",
      os: req.body.os || "",
      device_type: req.body.device_type || "",
      user_agent: req.body.user_agent || "",
      language: req.body.language || "",
      screen_resolution: req.body.screen_resolution || "",
      referrer: req.body.referrer || "",
      site_page: req.body.site_page || "",
      ip,
    });

    res.json({ success: true, data: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCookies = async (req, res) => {
  try {
    const { accepted } = req.query;

    const filter = {};
    if (accepted === "true") filter.accepted = true;
    if (accepted === "false") filter.accepted = false;

    const items = await CookieTrack.find(filter).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
