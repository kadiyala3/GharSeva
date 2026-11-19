const Review = require('../models/Review');
const ProviderProfile = require('../models/ProviderProfile');

exports.createReview = async (req, res) => {
  try {
    const { providerId, bookingId, rating, comment } = req.body;
    
    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId, customerId: req.user._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'Review already exists for this booking' });
    }
    
    const review = new Review({
      providerId,
      customerId: req.user._id,
      bookingId,
      rating,
      comment
    });
    
    await review.save();
    
    // Update Provider's average rating
    const providerReviews = await Review.find({ providerId });
    const avgRating = providerReviews.reduce((acc, item) => item.rating + acc, 0) / providerReviews.length;
    
    await ProviderProfile.findOneAndUpdate(
      { userId: providerId },
      { 
        averageRating: avgRating,
        totalReviews: providerReviews.length
      }
    );
    
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate('customerId', 'name profileImage');
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
