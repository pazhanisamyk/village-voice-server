const mongoose = require('mongoose');

const ComplaintBoxSchema = new mongoose.Schema({
  complaintBoxName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'unresolved',
    enum: ['unresolved', 'resolved'] // optional enum
  },
  createdBy: {
    type: String,
    default: 'admin' // consider changing to ObjectId for future user reference
  }
}, { timestamps: true });

module.exports = mongoose.model('ComplaintBox', ComplaintBoxSchema);
