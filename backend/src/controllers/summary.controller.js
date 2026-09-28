import { GoogleGenerativeAI } from "@google/generative-ai";
import { Meeting } from "../models/meeting.model.js";
import agenda from "../jobs/agenda.js";

const generateSummary = async (req, res) => {
  // Extract transcript and meetingCode from the frontend request
  const { transcript, meetingCode } = req.body;

  if (!transcript || transcript.trim() === "") {
    return res
      .status(400)
      .json({ message: "No conversation was recorded to summarize." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert meeting assistant for a community book reading group. 
      Read the following raw transcript and summarize it. 

      CRITICAL RULE 1 (THE ESCAPE HATCH): If the transcript is extremely short (under 30 words), just random greetings, or clearly a microphone test, DO NOT invent a summary. DO NOT apologize. Simply output EXACTLY this text and nothing else:
      "🎙️ This appears to be a brief audio test or a very short session. No major topics were recorded."
      
      CRITICAL RULE 2 (CONCISENESS): If it is a real meeting, provide a crisp, highly accurate summary. Do not use fluffy AI filler words (like "delve", "tapestry", "beautifully"). Be concise so people can quickly capture the essence of the meeting, but do not leave out the core philosophies discussed.

      If it is a real meeting, format your response EXACTLY like this:

      ### 🎯 The Essence
      [Write 2 to 3 clear sentences summarizing the main theme of the discussion so an absent member instantly knows what they missed.]

      ### 🗣️ Key Points & Philosophies
      * [Use concise bullet points to list the actual topics, verses, or stories discussed.]
      * [Extract real details from the transcript. Do not invent details to fill space.]

      ### ✅ Action Items
      * [List any specific tasks, homework, or reading assignments given to people.]
      * [If no tasks were mentioned, just write: "No specific action items recorded today."]

      ### 🙏 Where We Left Off
      [Write 1 natural sentence about where the reading stopped and a brief welcoming thought for next time.]

      Here is the transcript to summarize:
      "${transcript}"
    `;

    let summaryText = "";
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      try {
        const result = await model.generateContent(prompt);
        summaryText = result.response.text();
        break;
      } catch (apiError) {
        attempt++;
        console.warn(`AI Attempt ${attempt} failed: ${apiError.message}`);
        if (attempt >= maxRetries) throw apiError;
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }

    // // --- CLEANED UP BACKGROUND TRIGGER ---
    // if (meetingCode) {
    //   await agenda.now("send-summary-email", {
    //     meetingCode: meetingCode,
    //     summaryText: summaryText,
    //     counselorName: req.user?.name, // From your authenticate middleware
    //   });

    //   console.log(
    //     `[SummaryController] Queued summary email job for meeting code: ${meetingCode}`,
    //   );
    // } else {
    //   console.warn(
    //     `[SummaryController] No meetingCode provided in request. AI summary generated, but emails will NOT be sent.`,
    //   );
    // }
    // ------------------------------------------------

    res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error("AI Error:", error);
    if (error.status === 503) {
      return res.status(503).json({
        message:
          "Google AI is currently experiencing high demand. Please try summarizing again in a minute.",
      });
    }
    res.status(500).json({ message: "Failed to generate AI summary." });
  }
};

export const scheduleMeeting = async (req, res) => {
  try {
    const { title, scheduledStartTime, participants, user_id, meetingCode } =
      req.body;

    // 1. Create and save the meeting to MongoDB
    const newMeeting = await Meeting.create({
      title: title || "VaniLink Discussion Session",
      scheduledStartTime,
      participants,
      user_id,
      meetingCode,
      status: "scheduled",
    });

    // 2. Calculate the exact Date to send the reminder (15 minutes before)
    const meetingTime = new Date(scheduledStartTime);
    const reminderTime = new Date(meetingTime.getTime() - 15 * 60000);

    // 3. Schedule the background job
    if (reminderTime > new Date()) {
      await agenda.schedule(reminderTime, "send-meeting-reminder", {
        meetingId: newMeeting._id,
      });
      console.log(
        `[Scheduler] Job queued. Will send reminder at ${reminderTime}`,
      );
    } else {
      await agenda.now("send-meeting-reminder", {
        meetingId: newMeeting._id,
      });
      console.log(
        `[Scheduler] Meeting is starting very soon! Job queued immediately.`,
      );
    }

    res.status(201).json({
      message: "Meeting scheduled successfully",
      meeting: newMeeting,
    });
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    res.status(500).json({ message: "Failed to schedule meeting" });
  }
};

export { generateSummary };
