import mongoose, { Schema } from "mongoose";

const userScheme = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["devotee", "counselor", "admin"],
    default: "devotee",
  },
  counselorGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CounselorGroup",
    default: null, // Will be populated when they select a counselor from the dropdown
  },
});

const User = mongoose.model("User", userScheme);

export { User };
