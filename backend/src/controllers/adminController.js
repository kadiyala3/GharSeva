const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');

const getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalProviders = await User.countDocuments({ role: 'PROVIDER' });
    const totalBookings = await Booking.countDocuments();
    
    res.json({
      success: true,
      data: {
        totalCustomers,
        totalProviders,
        totalBookings,
        totalRevenue: 30000 // Mock revenue for display
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    
    // For providers, we want to include their profile verification status
    let users = await User.find(filter).select('-password').sort('-createdAt');
    
    if (role === 'PROVIDER') {
      // Manually join with ProviderProfile for simplicity, or use aggregate.
      // Better to just fetch profiles and attach
      const profiles = await ProviderProfile.find();
      users = users.map(user => {
        const userObj = user.toObject();
        userObj.profile = profiles.find(p => p.userId.toString() === user._id.toString());
        return userObj;
      });
    }
    
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.status = status;
    await user.save();
    
    res.json({ success: true, message: 'User status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyProvider = async (req, res) => {
  try {
    const { status } = req.body; // PENDING, VERIFIED, REJECTED
    const profile = await ProviderProfile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Provider profile not found' });
    
    profile.verificationStatus = status || 'VERIFIED';
    await profile.save();
    
    res.json({ success: true, message: `Provider verification updated to ${profile.verificationStatus}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')
      .populate('bookingId', 'bookingNumber')
      .sort('-createdAt');
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    
    complaint.status = status;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    await complaint.save();
    
    res.json({ success: true, message: 'Complaint resolved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, verifyProvider, getUsers, updateUserStatus, getComplaints, updateComplaintStatus };
