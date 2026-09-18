import { Agenda } from "agenda";
import { defineReminderAgent } from "../agents/reminder.agent.js";
import { MongoBackend } from "@agendajs/mongo-backend";
import { defineSummaryAgent } from "../agents/summary.agent.js";
import dotenv from "dotenv";

dotenv.config();

// Use the exact same URI logic as your app.js
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://aadimunjale13_db_user:My2ZdOjZZLy60mHT@cluster0.qliavl2.mongodb.net/conferax";

const agenda = new Agenda({
  // Version 6 Syntax: Pass the dedicated MongoDB Backend adapter
  backend: new MongoBackend({
    address: MONGO_URI,
    collection: "agendaJobs",
  }),
  processEvery: "1 minute",
  maxConcurrency: 10,
});
defineReminderAgent(agenda);
defineSummaryAgent(agenda);
agenda.on("ready", () => {
  console.log("🟡 SUCCESS: Agenda connected to MongoDB and ready.");
});

agenda.on("error", (error) => {
  console.error("🔴 ERROR: Agenda connection failed:", error.message);
});

export default agenda;
