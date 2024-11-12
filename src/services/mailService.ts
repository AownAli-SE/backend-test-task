import { createTransport } from "nodemailer";
import { InternalServerError, ServiceUnavailable } from "http-errors";
import { logError } from "./loggingService";

// Checking SMTP values
const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const user = process.env.SMTP_USER;
const password = process.env.SMTP_PASSWORD;

if (!host || !port || isNaN(parseInt(port)) || !user || !password) {
  throw InternalServerError("SMTP configuration not defined properly");
}

// Creating transporter
const transporter = createTransport({
  host,
  port: parseInt(port),
  auth: {
    user,
    pass: password,
  },
});

// Sending email handler
export const sendEmail = async (recipientEmail: string, password: string, subject: string = "", html: string = "") => {
  const options = {
    from: "test@task.com",
    to: recipientEmail,
    subject: subject || "Welcome Email",
    text: "Your account has been successfully created. Please use password attached to thie email to login.",
    html:
      html ||
      `<p>Your account has been successfully created. Please use the password provided below to log in.</p><br/><p>Your password: <strong>${password}</strong></p>`,
  };

  try {
    await transporter.sendMail(options);
  } catch (error) {
    logError("Email sending failed", error, recipientEmail);
    throw ServiceUnavailable("Email sending failed, please try again later.");
  }
};
