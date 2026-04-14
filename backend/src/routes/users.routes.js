import express from "express";
import {
  login,
  register,
  getUserHistory,
  addToHistory,
  removeFromHistory,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/login", login);
router.post("/register", register);


router.get("/get_all_activity", authenticate, getUserHistory);
router.post("/add_to_activity", authenticate, addToHistory);

router.delete("/history/:meetingCode", authenticate, removeFromHistory);

export default router;
