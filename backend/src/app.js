import dotenv from "dotenv";
dotenv.config();

import agenda from "./jobs/agenda.js";

import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import userRoutes from "./routes/users.routes.js";
import livekitRoutes from "./routes/livekit.routes.js";
import summaryRoutes from "./routes/summary.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import webhookRoutes from "./routes/webhooks.routes.js";

const app = express();
const server = createServer(app);

app.set("port", process.env.PORT || 8000);
app.use(cors());

app.use("/api/v1/webhooks", webhookRoutes);

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/livekit", livekitRoutes);
app.use("/api/v1/meetings", summaryRoutes);
app.use("/api/v1/library", libraryRoutes);

const start = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI ||
      "mongodb+srv://aadimunjale13_db_user:My2ZdOjZZLy60mHT@cluster0.qliavl2.mongodb.net/conferax";

    // 1. Connect to MongoDB
    const connectionDb = await mongoose.connect(MONGO_URI);
    console.log(
      `🟢 SUCCESS: Connected to MongoDB Host: ${connectionDb.connection.host}`,
    );

    // 2. Start the Agenda background worker
    await agenda.start();
    console.log(`🟡 SUCCESS: Agenda background job queue started.`);

    // 3. Graceful shutdown: Stop jobs safely if the server restarts
    process.on("SIGTERM", async () => {
      console.log("Shutting down Server and Agenda gracefully...");
      await agenda.stop();
      process.exit(0);
    });

    // 4. Start your Express server
    server.listen(app.get("port"), () => {
      console.log(`🚀 Server listening on port ${app.get("port")}`);
    });
  } catch (error) {
    console.log("🔴 ERROR: Could not connect to MongoDB!");
    console.error(error);
  }
};

start();


