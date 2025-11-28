import express from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);
router.post("/", createService);
router.put("/:id", updateService);   // ⬅️ REQUIRED
router.delete("/:id", deleteService); // ⬅️ REQUIRED

export default router;
