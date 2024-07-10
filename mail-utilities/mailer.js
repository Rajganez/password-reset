import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail.com",
  auth: {
    user: "rajganez24@gmail.com",
    pass: process.env.MAIL_PASS || "",
  },
});

const mailOptions = {
  from: "rajganez24@gmail.com",
  to: [],
  subject: "Password Reset Link",
  text: "Click on the link below to reset your password",
//   html: `<Link to="https://passwordresetbyraj.netlify.app/passwordreset/${token}">Reset Password</Link>`,
};

export { mailOptions, transporter }