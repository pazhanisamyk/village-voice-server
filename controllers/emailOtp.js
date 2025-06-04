const emailOtp = require('../models/emailOtp');
const sendEmail = require('../utils/nodemailer');
const User = require('../models/auth');
const bcrypt = require('bcryptjs');

// Send Otp
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await emailOtp.deleteMany({ email }); // Remove old OTPs
        await emailOtp.create({ email, otp });
        // await sendEmail(email, otp);
        // res.status(200).json({ message: 'OTP sent successfully' });
        res.status(200).json({ message: 'OTP sent successfully', success: true, otp: otp });
    } catch (error) {
        console.error("Error sending otp:", error);
        res.status(500).json({ message: 'Failed to send OTP', error: err.message });
    }
};

// verify otp
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

          const record = await emailOtp.findOne({ email, otp });
  if (!record) {
    return res.status(422).json({ message: 'Invalid or expired OTP' });
  }

  // OTP is valid — you can now log the user in or issue a token
  await emailOtp.deleteMany({ email }); // cleanup
  res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error("Error verify otp:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        // Find the user by email, not by ID
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
    
        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
    
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: 'Error changing password' });
    }
};


module.exports = { sendOtp, verifyOtp, forgotPassword };
