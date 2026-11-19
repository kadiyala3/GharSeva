const ProviderProfile = require('../models/ProviderProfile');
const User = require('../models/User');

const getProviders = async (req, res) => {
  try {
    const query = { verificationStatus: 'VERIFIED' };
    // Search functionality...
    const providers = await ProviderProfile.find(query).populate('userId', 'name profileImage').populate('services');
    res.json({ success: true, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProviderById = async (req, res) => {
  try {
    const provider = await ProviderProfile.findOne({ userId: req.params.id }).populate('userId', 'name profileImage email').populate('services');
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });
    res.json({ success: true, data: provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProviderProfile = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Provider profile not found' });

    Object.assign(profile, req.body);
    const updatedProfile = await profile.save();
    res.json({ success: true, data: updatedProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProviderAvailability = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Provider profile not found' });
    
    const schedule = (profile.availability && profile.availability.length > 0) 
      ? profile.availability.map(a => ({
          day: a.day,
          available: a.available,
          slots: [{ startTime: a.startTime || '09:00', endTime: a.endTime || '18:00' }]
        }))
      : [];
      
    res.json({ success: true, data: { schedule } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const saveProviderAvailability = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Provider profile not found' });

    const { schedule } = req.body;
    if (Array.isArray(schedule)) {
      profile.availability = schedule.map(s => ({
        day: s.day,
        available: s.available !== undefined ? s.available : true,
        startTime: s.slots && s.slots[0] ? s.slots[0].startTime : '09:00',
        endTime: s.slots && s.slots[0] ? s.slots[0].endTime : '18:00'
      }));
      await profile.save();
    }

    res.json({ success: true, message: 'Availability saved successfully', data: profile.availability });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProviders, getProviderById, updateProviderProfile, getProviderAvailability, saveProviderAvailability };
