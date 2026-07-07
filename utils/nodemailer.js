// utils/nodemailer.js
const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password (NOT your real password)
      },
      tls: {
        rejectUnauthorized: false, // fixes self-signed cert error (safe for Gmail)
      },
    });

    const info = await transporter.sendMail({
      from: `"Village Voice" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Village Voice One-Time Password",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;