import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create the transporter using your .env credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
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
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(
      `[EmailService] Email sent successfully to ${to}. Message ID: ${info.messageId}`,
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      `[EmailService] Failed to send email to ${to}:`,
      error.message,
    );
    // We throw the error so the Agenda job knows it failed and can retry it later
    throw error;
  }
};
