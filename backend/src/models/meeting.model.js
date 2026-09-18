import mongoose, { Schema } from "mongoose";

const participantSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Participant",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    reminderStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    reminderSentAt: {
      type: Date,
    },
    summaryStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    summarySentAt: {
      type: Date,
    },
  },
  { _id: true },
);

const meetingSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    meetingCode: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "VaniLink Discussion Session",
      trim: true,
    },
    scheduledStartTime: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
      index: true,
    },
    participants: [participantSchema],
    reminderSent: {
      type: Boolean,
      default: false,
      index: true,
    },
    reminderSentAt: {
      type: Date,
    },
    summarySent: {
      type: Boolean,
      default: false,
      index: true,
    },
    summarySentAt: {
      type: Date,
    },
    // Existing fields maintained for full backward compatibility
    date: {
      type: Date,
      default: Date.now,
      required: true,
      expires: "14d", // Preserves your existing 14-day automatic cleanup
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to quickly fetch upcoming scheduled meetings that need reminders
meetingSchema.index({ status: 1, reminderSent: 1, scheduledStartTime: 1 });

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };
