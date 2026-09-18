import { Meeting } from "../models/meeting.model.js";
import { sendEmail } from "../services/email.service.js";

/**
 * Defines the job logic for sending post-meeting summaries.
 * @param {import("agenda").Agenda} agenda - The Agenda instance
 */
export const defineSummaryAgent = (agenda) => {
  agenda.define("send-summary-email", async (job) => {
    // We pass both the meeting ID and the actual summary text into the job
    const { meetingId, summaryText } = job.attrs.data;
    console.log(
      `[SummaryAgent] Processing post-meeting summary for meeting ID: ${meetingId}`,
    );

    try {
      const meeting = await Meeting.findById(meetingId);

      // Idempotency & Safety Checks
      if (!meeting) {
        console.log(`[SummaryAgent] Meeting ${meetingId} not found. Aborting.`);
        return;
      }
      if (meeting.summarySent) {
        console.log(
          `[SummaryAgent] Summary already sent for ${meetingId}. Aborting.`,
        );
        return;
      }

      let allEmailsSuccessful = true;

      for (const participant of meeting.participants) {
        if (participant.summaryStatus === "pending") {
          try {
            console.log(
              `[SummaryAgent] Sending summary to ${participant.email}...`,
            );

            await sendEmail({
              to: participant.email,
              subject: `Meeting Summary: "${meeting.title}"`,
              text: `Hi ${participant.name},\n\nHere is the summary from your recent session "${meeting.title}":\n\n${summaryText}`,
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                  <h2>Meeting Summary: ${meeting.title}</h2>
                  <p>Hi <b>${participant.name}</b>,</p>
                  <p>Here are the AI-generated notes and key discussion points from your recent session:</p>
                  <hr style="border: 1px solid #eee; margin: 20px 0;"/>
                  <!-- Using pre-wrap preserves Gemini's markdown/line breaks -->
                  <pre style="white-space: pre-wrap; font-family: inherit; background: #f9f9f9; padding: 15px; border-radius: 5px;">${summaryText}</pre>
                </div>
              `,
            });

            participant.summaryStatus = "sent";
            participant.summarySentAt = new Date();
          } catch (error) {
            console.error(
              `[SummaryAgent] Failed to email ${participant.email}:`,
              error.message,
            );
            participant.summaryStatus = "failed";
            allEmailsSuccessful = false;
          }
        }
      }

      // If everyone got the email, mark the entire meeting as completed and summarized
      if (allEmailsSuccessful) {
        meeting.summarySent = true;
        meeting.summarySentAt = new Date();
        meeting.status = "completed";
      }

      await meeting.save();
      console.log(
        `[SummaryAgent] Finished processing summary for meeting ID: ${meetingId}`,
      );
    } catch (error) {
      console.error(`[SummaryAgent] Critical error processing job:`, error);
      throw error;
    }
  });
};
