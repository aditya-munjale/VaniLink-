import express from "express";
import { generateSummary } from "../controllers/summary.controller.js";

const router = express.Router();


router.post("/summary", generateSummary);

export default router;
