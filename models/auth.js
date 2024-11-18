// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },       // Optionally add a default
  language: { type: String, default: 'en' },         // Default language
  darkMode: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // Role field with 'user' as default
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
