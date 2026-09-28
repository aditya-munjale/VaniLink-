import express from "express";
import {
  login,
  register,
  getUserHistory,
  addToHistory,
  removeFromHistory,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { CounselorGroup } from "../models/CounselorGroup.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

router.get("/get_all_activity", authenticate, getUserHistory);
router.post("/add_to_activity", authenticate, addToHistory);

router.delete("/history/:meetingCode", authenticate, removeFromHistory);
router.get("/counselors", async (req, res) => {
  try {
    const groups = await CounselorGroup.find({}, "_id counselorName");
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch counselors" });
  }
});

export default router;
