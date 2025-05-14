const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  complaintId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
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
    enum: ['unresolved', 'resolved', 'rejected', 'inprogress'] // optional enum
  },
  createdBy: {
    type: String,
    default: 'user' // consider changing to ObjectId for future user reference
  },
  reason: {
    type: String,
    default: 'Awaiting for admin review'
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
