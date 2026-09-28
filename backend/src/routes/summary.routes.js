import express from "express";
import {
  generateSummary,
  scheduleMeeting,
} from "../controllers/summary.controller.js";


import { authenticate } from "../middlewares/auth.middleware.js";
import { verifyAdminOrCounselor } from "../middlewares/role.middleware.js";

const router = express.Router();


router.post("/summary", authenticate, verifyAdminOrCounselor, generateSummary);
router.post("/schedule", authenticate, verifyAdminOrCounselor, scheduleMeeting);

export default router;
