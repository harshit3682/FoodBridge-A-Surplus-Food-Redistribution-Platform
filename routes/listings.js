const express = require('express');
const router = express.Router();
const FoodListing = require('../models/FoodListing');
const { protect, requireRole } = require('../middleware/auth');

// @route   POST /api/listings
// @desc    Create a new food listing (Donor only)
// @access  Private (DONOR)
router.post('/', protect, requireRole('DONOR'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      quantity,
      unit,
      availableFrom,
      availableUntil,
      pickupLocation,
      images,
      specialInstructions
    } = req.body;

    // Validation
    if (!title || !description || !quantity || !availableUntil) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, quantity, and availableUntil'
      });
    }

    // Validate dates
    const fromDate = availableFrom ? new Date(availableFrom) : new Date();
    const untilDate = new Date(availableUntil);

    if (untilDate <= fromDate) {
      return res.status(400).json({
        success: false,
        message: 'Available until must be after available from date'
      });
    }

    // Create listing
    const listing = await FoodListing.create({
      donor: req.user.id,
      title,
      description,
      category,
      quantity,
      unit,
      availableFrom: fromDate,
      availableUntil: untilDate,
      pickupLocation,
      images,
      specialInstructions,
      status: 'AVAILABLE'
    });

    await listing.populate('donor', 'name email organization');

    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/listings/mine
// @desc    Get all listings created by the current donor
// @access  Private (DONOR)
router.get('/mine', protect, requireRole('DONOR'), async (req, res) => {
  try {
    const listings = await FoodListing.find({ donor: req.user.id })
      .populate('donor', 'name email organization')
      .populate('claimedBy', 'name email organization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/listings/available
// @desc    Get all available listings (NGO only)
// @access  Private (NGO)
router.get('/available', protect, requireRole('NGO'), async (req, res) => {
  try {
    const now = new Date();
    
    // Find listings that are AVAILABLE and not expired
    const listings = await FoodListing.find({
      status: 'AVAILABLE',
      availableUntil: { $gt: now } // Not expired yet
    })
      .populate('donor', 'name email organization phone address')
      .sort({ availableUntil: 1 }); // Sort by earliest expiry first

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/listings/:id
// @desc    Get a single listing by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id)
      .populate('donor', 'name email organization phone address')
      .populate('claimedBy', 'name email organization');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete a listing (Donor only, their own)
// @access  Private (DONOR)
router.delete('/:id', protect, requireRole('DONOR'), async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if listing belongs to the donor
    if (listing.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    // Don't allow deletion if already claimed
    if (listing.status === 'CLAIMED' || listing.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a claimed or completed listing'
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;



