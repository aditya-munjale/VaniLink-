import express from "express";
import { generateSummary } from "../controllers/summary.controller.js";
import {
  scheduleMeeting /*, your other summary functions */,
} from "../controllers/summary.controller.js";

const router = express.Router();

router.post("/summary", generateSummary);
router.post("/schedule", scheduleMeeting);

export default router;
