import express from "express";
import { trackCookie, getCookies } from "../controllers/cookieController.js";

const router = express.Router();

router.post("/track", trackCookie);
router.get("/", getCookies);

export default router;
