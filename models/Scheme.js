const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  schemeName: {
    type: String,
    required: true,
    trim: true
  },
  schemeUrl: {
    type: String,
    required: true,
    trim: true
  },
  schemeDesc: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    default: 'admin'
  }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', SchemeSchema);
