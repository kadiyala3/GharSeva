const Booking = require('../models/Booking');
const Address = require('../models/Address');

const createBooking = async (req, res) => {
  try {
    const { providerId, serviceId, address, addressId, bookingDate, startTime, problemDescription, estimatedPrice } = req.body;
    
    // Check for double booking logic here
    const existingBooking = await Booking.findOne({
      providerId,
      bookingDate,
      startTime,
      status: { $in: ['PENDING', 'ACCEPTED', 'CONFIRMED'] }
    });

    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'Provider is unavailable at the selected time' });
    }

    let finalAddress = address;
    if (!finalAddress && addressId) {
      const savedAddress = await Address.findById(addressId);
      if (savedAddress) {
        finalAddress = {
          addressLine: savedAddress.addressLine,
          area: savedAddress.area,
          city: savedAddress.city,
          state: savedAddress.state,
          pincode: savedAddress.pincode
        };
      }
    }

    const bookingNumber = `GS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

    const booking = await Booking.create({
      bookingNumber,
      customerId: req.user._id,
      providerId,
      serviceId,
      address: finalAddress,
      bookingDate,
      startTime,
      problemDescription,
      estimatedPrice
    });

    res.status(201).json({ success: true, data: booking, message: 'Booking created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone')
      .populate('serviceId', 'name basePrice')
      .sort('-createdAt');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id }).populate('providerId', 'name profileImage').populate('serviceId', 'name');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user._id }).populate('customerId', 'name phone').populate('serviceId', 'name');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    // Ensure provider owns booking, or user is admin
    if (booking.providerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    booking.status = req.body.status;
    const updatedBooking = await booking.save();
    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone profileImage')
      .populate('serviceId', 'name basePrice description');
      
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    const userId = req.user._id.toString();
    const isCustomer = booking.customerId && booking.customerId._id.toString() === userId;
    const isProvider = booking.providerId && booking.providerId._id.toString() === userId;
    const isAdmin = req.user.role === 'ADMIN';
    
    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }
    
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const userId = req.user._id.toString();
    const isCustomer = booking.customerId && booking.customerId.toString() === userId;
    const isProvider = booking.providerId && booking.providerId.toString() === userId;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this booking' });
    }

    await booking.deleteOne();
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getProviderBookings, updateBookingStatus, getAllBookings, getBookingById, deleteBooking };
