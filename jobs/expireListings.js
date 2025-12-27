const cron = require('node-cron');
const FoodListing = require('../models/FoodListing');
const Claim = require('../models/Claim');

// Run every 5 minutes
const expireListingsJob = cron.schedule('*/5 * * * *', async () => {
  try {
    const now = new Date();
    
    // Find all listings that are AVAILABLE but have passed their expiry time
    const expiredListings = await FoodListing.find({
      status: 'AVAILABLE',
      availableUntil: { $lt: now }
    });

    if (expiredListings.length > 0) {
      console.log(`🕒 Found ${expiredListings.length} expired listing(s). Marking as EXPIRED...`);

      // Update listings to EXPIRED status
      const updateResult = await FoodListing.updateMany(
        {
          status: 'AVAILABLE',
          availableUntil: { $lt: now }
        },
        {
          $set: { status: 'EXPIRED' }
        }
      );

      // Also reject any pending claims for these expired listings
      const listingIds = expiredListings.map(listing => listing._id);
      await Claim.updateMany(
        {
          listing: { $in: listingIds },
          status: 'PENDING'
        },
        {
          status: 'REJECTED',
          rejectedReason: 'Listing expired'
        }
      );

      console.log(`✅ Updated ${updateResult.modifiedCount} listing(s) to EXPIRED status`);
    }
  } catch (error) {
    console.error('❌ Error in expireListingsJob:', error);
  }
}, {
  scheduled: false, // Don't start automatically, we'll start it manually
  timezone: "UTC"
});

// Export function to start the job
exports.startExpireJob = () => {
  expireListingsJob.start();
  console.log('⏰ Expiry job started - running every 5 minutes');
};

// Export function to stop the job
exports.stopExpireJob = () => {
  expireListingsJob.stop();
  console.log('⏰ Expiry job stopped');
};



