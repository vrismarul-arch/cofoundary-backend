import jwt from "jsonwebtoken";

// Verify Admin Token (Login Required)
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - Token Missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Store decoded admin info
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token Invalid or Expired" });
  }
};

// Ensure Only Admin Users can Access
export const adminOnly = (req, res, next) => {
  if (!req.admin || !req.admin.isAdmin) {
    return res.status(403).json({ message: "Access Denied - Admins Only" });
  }
  next();
};
