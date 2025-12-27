const express = require('express');
const router = express.Router();
const FoodListing = require('../models/FoodListing');
const Claim = require('../models/Claim');
const User = require('../models/User');

// @route   GET /api/stats/public
// @desc    Get public statistics for landing page
// @access  Public
router.get('/public', async (req, res) => {
  try {
    // Get total food saved (sum of completed listings)
    const completedListings = await FoodListing.find({ status: 'COMPLETED' });
    
    // Calculate total food saved in kg
    let totalFoodSaved = 0;
    completedListings.forEach(listing => {
      if (listing.unit === 'kg') {
        totalFoodSaved += listing.quantity;
      } else if (listing.unit === 'servings') {
        // Approximate: 1 serving ≈ 0.3 kg
        totalFoodSaved += listing.quantity * 0.3;
      } else if (listing.unit === 'packages') {
        // Approximate: 1 package ≈ 0.5 kg
        totalFoodSaved += listing.quantity * 0.5;
      } else if (listing.unit === 'items') {
        // Approximate: 1 item ≈ 0.2 kg
        totalFoodSaved += listing.quantity * 0.2;
      } else if (listing.unit === 'liters') {
        // Approximate: 1 liter ≈ 1 kg
        totalFoodSaved += listing.quantity;
      }
    });

    // Calculate meals provided (assuming 1 serving = 1 meal)
    let mealsProvided = 0;
    completedListings.forEach(listing => {
      if (listing.unit === 'servings') {
        mealsProvided += listing.quantity;
      } else if (listing.unit === 'packages') {
        mealsProvided += listing.quantity * 2; // 2 servings per package
      } else if (listing.unit === 'items') {
        mealsProvided += listing.quantity; // 1 meal per item
      } else if (listing.unit === 'kg') {
        mealsProvided += Math.floor(listing.quantity * 3); // ~3 servings per kg
      } else if (listing.unit === 'liters') {
        mealsProvided += Math.floor(listing.quantity * 2); // ~2 servings per liter
      }
    });

    // Get total listings count
    const totalListings = await FoodListing.countDocuments();
    
    // Get total completed claims
    const totalCompleted = await Claim.countDocuments({ status: 'COMPLETED' });
    
    // Get total donors and NGOs
    const totalDonors = await User.countDocuments({ role: 'DONOR' });
    const totalNGOs = await User.countDocuments({ role: 'NGO' });

    // Get recent completed donations (for ticker)
    const recentClaims = await Claim.find({ status: 'COMPLETED' })
      .populate('listing', 'title quantity unit category')
      .populate('ngo', 'name organization')
      .sort({ completedAt: -1 })
      .limit(10);

    // Get donor info for each listing
    const recentDonations = [];
    for (const claim of recentClaims) {
      if (claim.listing) {
        const listing = await FoodListing.findById(claim.listing._id || claim.listing)
          .populate('donor', 'name organization');
        
        if (listing) {
          const donorName = listing.donor?.organization || listing.donor?.name || 'A donor';
          recentDonations.push({
            text: `${donorName} just donated ${listing.quantity} ${listing.unit} of ${listing.category || listing.title}`,
            timestamp: claim.completedAt || claim.updatedAt
          });
        }
      }
    }


    res.status(200).json({
      success: true,
      data: {
        totalFoodSaved: Math.round(totalFoodSaved * 10) / 10, // Round to 1 decimal
        mealsProvided: Math.round(mealsProvided),
        totalListings,
        totalCompleted,
        totalDonors,
        totalNGOs,
        recentDonations
      }
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
