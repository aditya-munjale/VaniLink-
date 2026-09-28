import mongoose from "mongoose";

const counselorGroupSchema = new mongoose.Schema(
  {
    counselorName: {
      type: String,
      required: true, // e.g., "HG Raspati Prabhuji"
    },
    counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dedicatedMeetingCode: {
      type: String,
      unique: true,
      required: true, // e.g., "raspati-reading-room"
    },
    devotees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export const CounselorGroup = mongoose.model(
  "CounselorGroup",
  counselorGroupSchema,
);
