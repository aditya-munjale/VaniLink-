import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Community Reading Session",
    },
    content: {
      type: String,
      required: true, // This will hold your beautiful Markdown AI summary
    },
    date: {
      type: Date,
      default: Date.now, // MongoDB will automatically stamp the exact date and time!
    },
  },
  { timestamps: true },
);

export const Summary = mongoose.model("Summary", summarySchema);
