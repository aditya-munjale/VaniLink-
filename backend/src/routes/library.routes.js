import express from "express";
import {
  saveSummary,
  getAllSummaries,
  deleteSummary,
  updateSummary,
} from "../controllers/library.controller.js";

// 1. Import your authentication middleware
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 2. Inject 'authenticate' to ensure req.user exists before saving/emailing
router.post("/save", authenticate, saveSummary);

// 3. Keep viewing public (or add authenticate if you want it private)
router.get("/all", getAllSummaries);

// 4. Protect your edit and delete routes so only logged-in users can modify
router.delete("/:id", authenticate, deleteSummary);
router.put("/:id", authenticate, updateSummary);

export default router;
