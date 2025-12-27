const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const FoodListing = require('../models/FoodListing');
const { protect, requireRole } = require('../middleware/auth');

// @route   POST /api/claims
// @desc    Create a new claim (NGO only)
// @access  Private (NGO)
router.post('/', protect, requireRole('NGO'), async (req, res) => {
  try {
    const { listingId, message, pickupTime } = req.body;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide listingId'
      });
    }

    // Check if listing exists and is available
    const listing = await FoodListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        message: 'Listing is not available for claiming'
      });
    }

    // Check if listing is expired
    if (new Date() > listing.availableUntil) {
      return res.status(400).json({
        success: false,
        message: 'Listing has expired'
      });
    }

    // Check if there's already a pending or accepted claim for this listing
    const existingClaim = await Claim.findOne({
      listing: listingId,
      status: { $in: ['PENDING', 'ACCEPTED'] }
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'This listing already has a pending or accepted claim'
      });
    }

    // Create claim
    const claim = await Claim.create({
      ngo: req.user.id,
      listing: listingId,
      message,
      pickupTime: pickupTime ? new Date(pickupTime) : null
    });

    await claim.populate('ngo', 'name email organization');
    await claim.populate('listing');

    res.status(201).json({
      success: true,
      data: claim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/claims/mine
// @desc    Get all claims made by the current NGO
// @access  Private (NGO)
router.get('/mine', protect, requireRole('NGO'), async (req, res) => {
  try {
    const claims = await Claim.find({ ngo: req.user.id })
      .populate('ngo', 'name email organization')
      .populate({
        path: 'listing',
        populate: { path: 'donor', select: 'name email organization phone address' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/claims/received
// @desc    Get all claims received by the current donor
// @access  Private (DONOR)
router.get('/received', protect, requireRole('DONOR'), async (req, res) => {
  try {
    // First, get all listings by this donor
    const listings = await FoodListing.find({ donor: req.user.id }).select('_id');
    const listingIds = listings.map(listing => listing._id);

    // Then, get all claims for these listings
    const claims = await Claim.find({ listing: { $in: listingIds } })
      .populate('ngo', 'name email organization phone address')
      .populate({
        path: 'listing',
        populate: { path: 'donor', select: 'name email organization' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/claims/:id/accept
// @desc    Accept a claim (Donor only)
// @access  Private (DONOR)
router.patch('/:id/accept', protect, requireRole('DONOR'), async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('listing');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Check if listing belongs to the donor
    if (claim.listing.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this claim'
      });
    }

    if (claim.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Claim is not in pending status'
      });
    }

    // Generate 6-digit OTP for verification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update claim status and add verification code
    claim.status = 'ACCEPTED';
    claim.verificationCode = verificationCode;
    await claim.save();

    // Update listing status and claimedBy
    claim.listing.status = 'CLAIMED';
    claim.listing.claimedBy = claim.ngo._id;
    claim.listing.claimedAt = new Date();
    await claim.listing.save();

    // Reject other pending claims for the same listing
    await Claim.updateMany(
      {
        listing: claim.listing._id,
        _id: { $ne: claim._id },
        status: 'PENDING'
      },
      {
        status: 'REJECTED',
        rejectedReason: 'Another claim was accepted for this listing'
      }
    );

    await claim.populate('ngo', 'name email organization');
    await claim.populate('listing');

    res.status(200).json({
      success: true,
      data: claim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/claims/:id/reject
// @desc    Reject a claim (Donor only)
// @access  Private (DONOR)
router.patch('/:id/reject', protect, requireRole('DONOR'), async (req, res) => {
  try {
    const { rejectedReason } = req.body;
    const claim = await Claim.findById(req.params.id).populate('listing');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Check if listing belongs to the donor
    if (claim.listing.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this claim'
      });
    }

    if (claim.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Claim is not in pending status'
      });
    }

    // Update claim status
    claim.status = 'REJECTED';
    claim.rejectedReason = rejectedReason || 'Rejected by donor';
    await claim.save();

    await claim.populate('ngo', 'name email organization');
    await claim.populate('listing');

    res.status(200).json({
      success: true,
      data: claim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/claims/:id/complete
// @desc    Mark a claim as completed (Donor only)
// @access  Private (DONOR)
router.patch('/:id/complete', protect, requireRole('DONOR'), async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('listing');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Check if listing belongs to the donor
    if (claim.listing.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this claim'
      });
    }

    if (claim.status !== 'ACCEPTED') {
      return res.status(400).json({
        success: false,
        message: 'Only accepted claims can be completed'
      });
    }

    // Update claim status
    claim.status = 'COMPLETED';
    claim.completedAt = new Date();
    await claim.save();

    // Update listing status
    claim.listing.status = 'COMPLETED';
    await claim.listing.save();

    await claim.populate('ngo', 'name email organization');
    await claim.populate('listing');

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('claimAccepted', {
        claimId: claim._id,
        listingId: claim.listing._id,
        ngo: {
          name: claim.ngo.name,
          organization: claim.ngo.organization
        },
        verificationCode: verificationCode
      });
    }

    res.status(200).json({
      success: true,
      data: claim,
      verificationCode: verificationCode // Include in response for donor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/claims/:id/verify
// @desc    Verify pickup with OTP (Donor only)
// @access  Private (DONOR)
router.post('/:id/verify', protect, requireRole('DONOR'), async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const claim = await Claim.findById(req.params.id).populate('listing');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Check if listing belongs to the donor
    if (claim.listing.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to verify this claim'
      });
    }

    if (claim.status !== 'ACCEPTED') {
      return res.status(400).json({
        success: false,
        message: 'Only accepted claims can be verified'
      });
    }

    if (!claim.verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found for this claim'
      });
    }

    if (claim.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Mark as verified and completed
    claim.verifiedAt = new Date();
    claim.status = 'COMPLETED';
    claim.completedAt = new Date();
    await claim.save();

    // Update listing status
    claim.listing.status = 'COMPLETED';
    await claim.listing.save();

    await claim.populate('ngo', 'name email organization');
    await claim.populate('listing');

    res.status(200).json({
      success: true,
      message: 'Pickup verified successfully',
      data: claim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/claims/:id
// @desc    Get a single claim by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('ngo', 'name email organization phone address')
      .populate({
        path: 'listing',
        populate: { path: 'donor', select: 'name email organization phone address' }
      });

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Check authorization - either the NGO or the donor can view
    const listing = await FoodListing.findById(claim.listing._id || claim.listing);
    if (listing.donor.toString() !== req.user.id && claim.ngo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this claim'
      });
    }

    res.status(200).json({
      success: true,
      data: claim
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



