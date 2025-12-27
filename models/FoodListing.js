const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Bakery', 'Main Course', 'Salads', 'Desserts', 'Beverages', 'Other'],
    default: 'Other'
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: 1
  },
  unit: {
    type: String,
    enum: ['servings', 'packages', 'items', 'kg', 'liters'],
    default: 'servings'
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'CLAIMED', 'EXPIRED', 'COMPLETED'],
    default: 'AVAILABLE'
  },
  availableFrom: {
    type: Date,
    required: [true, 'Please provide available from time'],
    default: Date.now
  },
  availableUntil: {
    type: Date,
    required: [true, 'Please provide expiry time']
  },
  pickupLocation: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  claimedAt: {
    type: Date,
    default: null
  },
  images: [{
    type: String // URLs to images
  }],
  specialInstructions: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
foodListingSchema.index({ status: 1, availableUntil: 1 });
foodListingSchema.index({ donor: 1 });
foodListingSchema.index({ claimedBy: 1 });

module.exports = mongoose.model('FoodListing', foodListingSchema);



