const emailOtp = require('../models/emailOtp');
const sendEmail = require('../utils/nodemailer');
const User = require('../models/auth');
const bcrypt = require('bcryptjs');

// Send Otp
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
            if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await emailOtp.deleteMany({ email }); // Remove old OTPs
        await emailOtp.create({ email, otp });
        await sendEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully' });
        // res.status(200).json({ message: 'OTP sent successfully', success: true, otp: otp });
    } catch (error) {
        console.error("Error sending otp:", error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// verify otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await emailOtp.findOne({ email, otp });
    if (!record) {
      return res.status(422).json({ message: 'Invalid OTP' });
    }

    // ⏱ Manual expiry check (5 mins)
    const isExpired =
      Date.now() - record.createdAt.getTime() > 5 * 60 * 1000;

    if (isExpired) {
      await emailOtp.deleteMany({ email });
      return res.status(422).json({ message: 'OTP expired' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error' });
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
