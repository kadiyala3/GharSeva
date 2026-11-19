const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, transactionId } = req.body;
    
    const payment = new Payment({
      bookingId,
      amount,
      method,
      transactionId,
      status: 'SUCCESS', // Mocking success
      paidAt: Date.now()
    });
    
    await payment.save();
    
    await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'SUCCESS', finalPrice: amount });
    
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
