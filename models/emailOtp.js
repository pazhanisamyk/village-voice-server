// models/emailOtpModel.js
const mongoose = require('mongoose');

const emailOtpSchema = new mongoose.Schema({
  email: { type: String},
  otp: { type: String},
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires in 5 mins
  },
}, { timestamps: true });

module.exports = mongoose.model('emailOtp', emailOtpSchema);