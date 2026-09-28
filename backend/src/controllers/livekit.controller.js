import { AccessToken } from "livekit-server-sdk";
import { CounselorGroup } from "../models/CounselorGroup.js";
import agenda from "../jobs/agenda.js"; // Import your Agenda instance

// 1. LIVEKIT TOKEN (Video & Data Permissions)
export const getToken = async (req, res) => {
  const { roomName, participantName } = req.body;

  try {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: participantName, name: participantName },
    );

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true, // Required for our new architecture!
    });

    const token = await at.toJwt();
    res.status(200).json({ token });
  } catch (error) {
    console.error("LiveKit Token Error:", error);
    res.status(500).json({ message: "Failed to generate LiveKit token" });
  }
};

// 2. DEEPGRAM TOKEN (Cloud AI Audio Pass)
export const getDeepgramToken = async (req, res) => {
  try {
    const projectId = process.env.DEEPGRAM_PROJECT_ID;
    const apiKey = process.env.DEEPGRAM_API_KEY;

    if (!projectId || !apiKey) {
      return res
        .status(500)
        .json({ message: "Deepgram credentials missing in .env" });
    }

    // Ask Deepgram for a temporary 2-hour key directly
    const response = await fetch(
      `https://api.deepgram.com/v1/projects/${projectId}/keys`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: "ConferaX Temp Key",
          scopes: ["usage:write"],
          time_to_live_in_seconds: 7200,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to generate Deepgram key: ${response.statusText}`,
      );
    }

    const data = await response.json();
    res.status(200).json({ key: data.key });
  } catch (error) {
    console.error("Deepgram Token Error:", error);
    res.status(500).json({ message: "Failed to generate Deepgram token" });
  }
};

// 3. SCHEDULE MEETING & EMAILS (Agenda Integration)
export const scheduleMeeting = async (req, res) => {
  try {
    const { startTime, title } = req.body;

    // 1. Change "name email" to "name username"
    const group = await CounselorGroup.findOne({
      counselorName: req.user.name,
    }).populate("devotees", "name username");

    if (!group) {
      return res.status(403).json({
        error: "No counselor group found.",
      });
    }

    // 2. Change devotee.email to devotee.username
    const devoteeEmails = group.devotees.map((devotee) => devotee.username);

    // Optional: Add this log so you can verify it worked in the terminal!
    console.log("📨 Emails to notify:", devoteeEmails);

    const meetingTime = new Date(startTime);
    const reminderTime = new Date(meetingTime.getTime() - 15 * 60000);

    await agenda.schedule(reminderTime, "send-reminder-email", {
      meetingCode: group.dedicatedMeetingCode,
      title: title,
      startTime: startTime,
      counselorName: group.counselorName,
      participants: devoteeEmails, // This will now contain your actual registered emails
    });

    res.status(200).json({
      message: "Meeting scheduled and reminders queued successfully!",
      meetingCode: group.dedicatedMeetingCode,
      devoteesNotified: devoteeEmails.length,
    });
  } catch (error) {
    console.error("Scheduling Error:", error);
    res.status(500).json({ error: "Failed to schedule meeting" });
  }
};
