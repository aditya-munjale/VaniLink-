import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Meeting } from "../models/meeting.model.js";

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please Provide" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // 1. Pack the role into the secure JWT
      const token = jwt.sign(
        { username: user.username, name: user.name, role: user.role }, // <-- Added role
        process.env.JWT_SECRET || "your_super_secret_key",
        { expiresIn: "24h" },
      );

      // 2. Send the role and name back to the React frontend
      return res.status(httpStatus.OK).json({
        token: token,
        name: user.name, // <-- Send name to React
        role: user.role, // <-- Send role to React
      });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Username or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  console.log("📝 Incoming Registration:", { name, username, password });

  // --- 1. BACKEND SECURITY VALIDATION ---
  if (!name || name.trim().length < 2) {
    console.log("❌ Blocked: Name too short");
    return res
      .status(400)
      .json({ message: "Name must be at least 2 characters" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!username || !emailRegex.test(username)) {
    console.log("❌ Blocked: Invalid Email");
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!password || password.length < 6) {
    console.log("❌ Blocked: Password too short");
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  // --------------------------------------

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // 409 Conflict is the correct status for duplicate data!
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

const getUserHistory = async (req, res) => {
  try {
    // req.user.username comes automatically from our JWT middleware!
    const meetings = await Meeting.find({ user_id: req.user.username });
    res.json(meetings);
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

const addToHistory = async (req, res) => {
  const { meeting_code } = req.body;

  try {
    const newMeeting = new Meeting({
      user_id: req.user.username, // Comes from JWT middleware
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    res.status(httpStatus.CREATED).json({ message: "Added code to history" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

const removeFromHistory = async (req, res) => {
  try {
    const { meetingCode } = req.params;

    // req.user._id comes from your auth middleware!
    const userId = req.user._id;

    // Find the user and yank the specific meeting out of their history array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { meetingHistory: { meetingCode: meetingCode } },
      },
      { new: true }, // This returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Meeting removed from history successfully!" });
  } catch (error) {
    console.error("Error removing from history:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export { login, register, getUserHistory, addToHistory, removeFromHistory };
