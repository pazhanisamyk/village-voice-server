// utils/nodemailer.js
const nodemailer = require('nodemailer');

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your preferred email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Village Voice One-Time Password',
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });
};

module.exports = sendEmail;