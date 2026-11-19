import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import styles from './Auth.module.css'; // Reusing auth card styles for payment

const PaymentPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(location.state?.amount || 0);
  const [method, setMethod] = useState('UPI');
  
  useEffect(() => {
    if (!amount) {
      // fetch booking if amount not in state
      api.get(`/bookings/${id}`).then(res => {
        setAmount(res.data.data.estimatedPrice);
      }).catch(() => {
        toast.error('Booking not found');
        navigate('/customer/bookings');
      });
    }
  }, [id, amount, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock payment API
      await api.post('/payments', {
        bookingId: id,
        amount,
        method,
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
      
      toast.success('Payment Successful!');
      navigate(`/customer/bookings/${id}`); // redirect to booking details
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer} style={{ minHeight: '80vh' }}>
      <div className={styles.authCard} style={{ maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary-color)' }}>Complete Payment</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>
          Booking ID: {id}
        </p>
        
        <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '1rem', fontWeight: '500' }}>Amount to Pay</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-color)', marginTop: '0.5rem' }}>
            ₹{amount}
          </div>
        </div>

        <form onSubmit={handlePayment} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label>Payment Method</label>
            <select 
              value={method} 
              onChange={e => setMethod(e.target.value)}
              style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}
            >
              <option value="UPI">UPI</option>
              <option value="Card">Credit / Debit Card</option>
              <option value="Cash">Cash after service</option>
            </select>
          </div>
          
          {method === 'Card' && (
            <>
              <div className={styles.formGroup}>
                <label>Card Number (Mock)</label>
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" required style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>Expiry (Mock)</label>
                  <input type="text" placeholder="MM/YY" required style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                </div>
                <div className={styles.formGroup}>
                  <label>CVV (Mock)</label>
                  <input type="text" placeholder="XXX" required style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                </div>
              </div>
            </>
          )}

          {method === 'UPI' && (
            <div className={styles.formGroup}>
              <label>UPI ID (Mock)</label>
              <input type="text" placeholder="username@upi" required style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
          )}
          
          <button 
            type="submit" 
            className={styles.authButton}
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
