import { sendEmail } from "../services/email.service.js";

/**
 * Defines the job logic for sending meeting reminders.
 * @param {import("agenda").Agenda} agenda - The Agenda instance
 */
export const defineReminderAgent = (agenda) => {
  agenda.define("send-reminder-email", async (job) => {
    // 1. Extract the exact data passed from livekit.controller.js
    const { meetingCode, title, counselorName, participants } = job.attrs.data;

    console.log(`[ReminderAgent] Processing reminder for: ${title}`);
    console.log(
      `[ReminderAgent] Sending to ${participants?.length || 0} devotees.`,
    );

    try {
      if (!participants || participants.length === 0) {
        console.log(
          "[ReminderAgent] No participants found in group. Aborting email.",
        );
        return;
      }

      // 2. Send ONE email using BCC so devotees cannot see each other's email addresses
      await sendEmail({
        to: process.env.EMAIL_USER, // Send it to your own system email
        bcc: participants, // This array of emails is hidden from recipients
        subject: `Reminder: "${title}" is starting soon!`,
        text: `Hare Krishna!\n\nYour reading session "${title}" with ${counselorName} is starting in 15 minutes.\n\nJoin Code: ${meetingCode}\n\nEnter the lobby here: https://vanilink.vercel.app/`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px;">
            <h2>Hare Krishna! 🙏</h2>
            <p>Your reading session <b>"${title}"</b> with <b>${counselorName}</b> is starting in about 15 minutes.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px;"><b>Join Code:</b> <span style="font-family: monospace; font-size: 18px; color: #d97706;">${meetingCode}</span></p>
            </div>
            
            <!-- VaniLink Styled URL Button -->
            <a href="https://vanilink.vercel.app/" 
               style="background-color: #7C3AED; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; margin-bottom: 20px;">
              Enter VaniLink Lobby
            </a>
            
            <p style="margin-top: 10px; font-size: 13px; color: #777;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <a href="https://vanilink.vercel.app/" style="color: #7C3AED;">https://vanilink.vercel.app/</a>
            </p>
          </div>
        `,
      });

      console.log(`[ReminderAgent] Finished processing for: ${title}`);
    } catch (error) {
      console.error(`[ReminderAgent] Critical error sending emails:`, error);
      throw error;
    }
  });
};
