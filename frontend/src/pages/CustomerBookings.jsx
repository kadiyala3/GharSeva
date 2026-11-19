import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CustomerSidebar from '../components/CustomerSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        setBookings(data.data);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className={styles.loading}>Loading bookings...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <CustomerSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '1rem' }}>No bookings yet</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>You haven't made any service bookings yet.</p>
            <Link to="/services" style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '500' }}>
              Explore Services
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map(booking => (
              <div key={booking._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{booking.serviceId?.name || 'Service Booking'}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Booking ID: {booking.bookingNumber} | Date: {new Date(booking.bookingDate).toLocaleDateString()} at {booking.startTime}
                  </p>
                  <span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>
                    {booking.status}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '1rem' }}>₹{booking.finalPrice || booking.estimatedPrice}</p>
                  <Link to={`/customer/bookings/${booking._id}`} style={{ padding: '0.5rem 1rem', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerBookings;
