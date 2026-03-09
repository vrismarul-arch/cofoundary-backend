import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

// Routes
import serviceRoutes from "./routes/serviceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import cookieRoutes from "./routes/cookieRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cofoundryspaces.in",
      "https://form.cofoundryspaces.in",
      "https://co-foundaryfrom.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Default Route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// DB Connection
connectDB();

// API Routes
app.use("/api/admin", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cookies", cookieRoutes);

// Global Error Handler (optional—but recommended)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// Start Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
