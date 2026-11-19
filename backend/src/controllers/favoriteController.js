const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
  try {
    const favorite = new Favorite({
      customerId: req.user._id,
      providerId: req.params.providerId
    });
    await favorite.save();
    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Provider already in favorites' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      customerId: req.user._id,
      providerId: req.params.providerId
    });
    if (!favorite) return res.status(404).json({ success: false, message: 'Favorite not found' });
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ customerId: req.user._id }).populate('providerId', 'name profileImage email phone');
    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
