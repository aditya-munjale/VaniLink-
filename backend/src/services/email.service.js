import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, bcc, subject, text, html }) => {
  try {
    const data = await resend.emails.send({
      // For testing, Resend requires you to use this exact 'from' address
      // until you verify your own custom domain on their platform.
      from: "VaniLink Agent <onboarding@resend.dev>",
      to: to,
      bcc: bcc,
      subject: subject,
      text: text,
      html: html,
    });

    if (data.error) {
      console.error(`[EmailService] API Error:`, data.error.message);
      throw new Error(data.error.message);
    }

    console.log(`[EmailService] Email sent successfully! ID: ${data.data.id}`);
    return { success: true, messageId: data.data.id };
  } catch (error) {
    console.error(`[EmailService] Failed to send email:`, error.message);
    throw error;
  }
};
