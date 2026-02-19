import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import serviceRoutes from "./routes/serviceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import cookieRoutes from "./routes/cookieRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ ALLOW ALL ORIGINS */
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

connectDB();

app.use("/api/admin", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cookies", cookieRoutes);

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
