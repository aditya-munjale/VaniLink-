import express from "express";
import {
  saveSummary,
  getAllSummaries,
  deleteSummary
} from "../controllers/library.controller.js";

const router = express.Router();


router.post("/save", saveSummary);


router.get("/all", getAllSummaries);

router.delete("/:id", deleteSummary);

export default router;
