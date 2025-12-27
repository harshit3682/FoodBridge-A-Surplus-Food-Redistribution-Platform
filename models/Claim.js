const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodListing',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'],
    default: 'PENDING'
  },
  message: {
    type: String,
    trim: true
  },
  pickupTime: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  rejectedReason: {
    type: String,
    trim: true
  },
  verificationCode: {
    type: String,
    trim: true,
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
claimSchema.index({ ngo: 1, status: 1 });
claimSchema.index({ listing: 1 });

// Prevent duplicate pending/accepted claims for the same listing
claimSchema.index({ listing: 1, status: 1 });

module.exports = mongoose.model('Claim', claimSchema);



