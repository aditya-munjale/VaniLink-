import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create the transporter using your .env credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587, // Convert to number, default to 587
  secure: Number(process.env.EMAIL_PORT) === 465, // Automatically true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Reusable function to send emails
 * @param {string} to - The recipient's email address
 * @param {string} subject - The email subject line
 * @param {string} text - The plain text version of the email
 * @param {string} html - The HTML formatted version of the email
 */
export const sendEmail = async ({ to, bcc, subject, text, html }) => {
  // <-- 1. Add bcc here
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      bcc, // <-- 2. Pass it directly to Nodemailer here
      subject,
      text,
      html,
    });

    console.log(
      `[EmailService] Email sent successfully! Message ID: ${info.messageId}`,
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EmailService] Failed to send email:`, error.message);
    throw error;
  }
};
