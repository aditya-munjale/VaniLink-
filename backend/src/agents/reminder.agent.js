import { Meeting } from "../models/meeting.model.js";
import { sendEmail } from "../services/email.service.js";

/**
 * Defines the job logic for sending meeting reminders.
 * @param {import("agenda").Agenda} agenda - The Agenda instance
 */
export const defineReminderAgent = (agenda) => {
  agenda.define("send-meeting-reminder", async (job) => {
    // 1. Get the specific meeting ID passed into this job
    const { meetingId } = job.attrs.data;
    console.log(
      `[ReminderAgent] Processing reminder for meeting ID: ${meetingId}`,
    );

    try {
      // 2. Fetch the meeting from MongoDB
      const meeting = await Meeting.findById(meetingId);

      // 3. Idempotency & Safety Checks
      if (!meeting) {
        console.log(
          `[ReminderAgent] Meeting ${meetingId} not found. Aborting.`,
        );
        return;
      }
      if (meeting.status !== "scheduled") {
        console.log(
          `[ReminderAgent] Meeting ${meetingId} is cancelled or active. Aborting.`,
        );
        return;
      }
      if (meeting.reminderSent) {
        console.log(
          `[ReminderAgent] Reminder already sent for ${meetingId}. Aborting.`,
        );
        return;
      }

      let allEmailsSuccessful = true;

      // 4. Loop through participants and send emails
      for (const participant of meeting.participants) {
        // Only send if we haven't already sent to this specific person
        if (participant.reminderStatus === "pending") {
          try {
            console.log(
              `[ReminderAgent] Sending email to ${participant.email}...`,
            );

            await sendEmail({
              to: participant.email,
              subject: `Reminder: "${meeting.title}" is starting soon!`,
              text: `Hi ${participant.name},\n\nYour meeting "${meeting.title}" is starting in 15 minutes.\n\nJoin Code: ${meeting.meetingCode}`,
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                  <h2>Meeting Reminder</h2>
                  <p>Hi <b>${participant.name}</b>,</p>
                  <p>Your session <b>"${meeting.title}"</b> is starting in about 15 minutes.</p>
                  <p><b>Join Code:</b> ${meeting.meetingCode}</p>
                </div>
              `,
            });

            // Mark this specific participant as successful
            participant.reminderStatus = "sent";
            participant.reminderSentAt = new Date();
          } catch (error) {
            console.error(
              `[ReminderAgent] Failed to email ${participant.email}:`,
              error.message,
            );
            participant.reminderStatus = "failed";
            allEmailsSuccessful = false;
          }
        }
      }

      // 5. Update the main meeting document
      if (allEmailsSuccessful) {
        meeting.reminderSent = true;
        meeting.reminderSentAt = new Date();
      }

      // 6. Save the atomic updates to MongoDB
      await meeting.save();
      console.log(
        `[ReminderAgent] Finished processing for meeting ID: ${meetingId}`,
      );
    } catch (error) {
      console.error(`[ReminderAgent] Critical error processing job:`, error);
      throw error; // Throwing tells Agenda the job failed so it can automatically retry it later
    }
  });
};
