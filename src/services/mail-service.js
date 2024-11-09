import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_MAIL_API_KEY ?? "");

const sendEmail = async ({
  from = "",
  recipients = [],
  subject = "",
  text = "",
}) => {
  try {
    const res = await resend.emails.send({
      from: "domdental@gmail.ccom",
      to: ["lasapdominic@gmail.com"],
      subject: "Dom's Dental Appointment Notification",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });
    console.log("res", res);
  } catch (error) {
    console.error("EMAIL SERVICE ERROR:", error);
  }
};

export { sendEmail };
