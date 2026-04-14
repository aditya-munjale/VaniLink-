import express from "express";
import { getToken } from "../controllers/livekit.controller.js";
import { getDeepgramToken } from "../controllers/deepgram.controller.js";


const router = express.Router();


router.post("/getToken", getToken);


router.get("/deepgram/getToken", getDeepgramToken);

export default router;
