import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.model.js";
import { CounselorGroup } from "./src/models/CounselorGroup.js";
import bcrypt from "bcrypt";

dotenv.config();

// Preachers now strictly use email formats for their usernames
const preachers = [
  { name: "HG Raspati Prabhuji", username: "raspati@voicepune.com", code: "raspati-reading-room" },
  { name: "HG Shuklambar Annad Prabhuji", username: "shuklambar@voicepune.com", code: "shuklambar-reading-room" },
  { name: "HG Murali Mukunda Prabhuji", username: "murali@voicepune.com", code: "murali-reading-room" }
];

const seedPreachers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Wipe all existing counselors and groups to prevent duplicates
    await User.deleteMany({ role: "counselor" });
    await CounselorGroup.deleteMany({});

    const hashedPassword = await bcrypt.hash("securepassword123", 10);
    
    for (const p of preachers) {
      const user = await User.create({
        name: p.name,
        username: p.username, 
        password: hashedPassword, 
        role: "counselor"
      });

      await CounselorGroup.create({
        counselorName: user.name,
        counselorId: user._id,
        dedicatedMeetingCode: p.code,
        devotees: [] // Empty roster to start
      });
    }

    console.log("Counselors Seeded Successfully With Hashed Passwords!");
    process.exit();
  } catch (error) {
    console.error("Seed Error:", error);
    process.exit(1);
  }
};

seedPreachers();