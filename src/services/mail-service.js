import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_MAIL_API_KEY ?? "");

const sendEmail = async ({ subject = "", to = "", emailContent = "" }) => {
  try {
    const res = await resend.emails.send({
      // Current from is commented due to no domains yet
      // from: "domdental@gmail.ccom",
      from: process.env.EMAIL_DOMAIN_SENDER || "domdentalservices@resend.dev",
      //   constant email for dev testing , need domain for all email test
      to: ["lasapdominic@gmail.com"],
      subject: subject ?? "Dom's Dental Appointment Notification",
      html:
        emailContent ??
        "<p>Hi User! This email serves as your confirmation email for your appointment on Dom's Dental Services.</p>",
    });
    console.log("res", res);
  } catch (error) {
    console.error("EMAIL SERVICE ERROR:", error);
  }
};

export { sendEmail };
