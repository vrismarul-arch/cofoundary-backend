import express from "express";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public — anyone can view plans (frontend calling this)
router.get("/", getPlans);

// Admin Only — secure modification of plans
router.post("/", protect,  createPlan);
router.put("/:id", protect,  updatePlan);
router.delete("/:id", protect,  deletePlan);

export default router;
