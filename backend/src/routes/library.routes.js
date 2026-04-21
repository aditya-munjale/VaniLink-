import express from "express";
import {
  saveSummary,
  getAllSummaries,
  deleteSummary,
  updateSummary,
} from "../controllers/library.controller.js";

const router = express.Router();

router.post("/save", saveSummary);

router.get("/all", getAllSummaries);

router.delete("/:id", deleteSummary);

router.put("/:id", updateSummary);

export default router;
