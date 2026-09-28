import express from "express";
import {
  getToken,
  scheduleMeeting,
} from "../controllers/livekit.controller.js";
import { getDeepgramToken } from "../controllers/deepgram.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js"; // <-- Updated to match your export

const router = express.Router();

router.post("/getToken", getToken);
router.get("/deepgram/getToken", getDeepgramToken);

// The new scheduling route (protected by your JWT middleware)
router.post("/schedule", authenticate, scheduleMeeting);

export default router;
