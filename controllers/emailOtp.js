const emailOtp = require('../models/emailOtp');
const sendEmail = require('../utils/nodemailer');
const User = require('../models/auth');
const bcrypt = require('bcryptjs');

// Send Otp
const sendOtp = async (req, res) => {
    try {
        const { email, type } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists (case-insensitive)
        const user = await User.findOne({ email: { $regex: new RegExp('^' + normalizedEmail + '$', 'i') } });

        if (type === 'signup') {
            if (user) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        } else if (type === 'forgot_password' || type === 'change_email') {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await emailOtp.deleteMany({ email: normalizedEmail }); // Remove old OTPs
        await emailOtp.create({ email: normalizedEmail, otp });
        await sendEmail(normalizedEmail, otp);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error("Error sending otp:", error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

// verify otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const record = await emailOtp.findOne({ email: normalizedEmail, otp });
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
        const normalizedEmail = email.toLowerCase().trim();
        
        // Find the user by email, not by ID (case-insensitive)
        const user = await User.findOne({ email: { $regex: new RegExp('^' + normalizedEmail + '$', 'i') } });
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
