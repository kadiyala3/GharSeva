import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import CustomerSidebar from '../components/CustomerSidebar';
import styles from './Dashboard.module.css';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await api.get(`/bookings/${id}`);
        setBooking(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading details...</div>;
  if (!booking) return <div className={styles.loading}>Booking not found</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <CustomerSidebar />
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>Booking Details</h1>
          <span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>
            {booking.status}
          </span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Service Info</h3>
            <p style={{ margin: '0.5rem 0' }}><strong>ID:</strong> {booking.bookingNumber}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Service:</strong> {booking.serviceId?.name || 'Unknown'}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Time:</strong> {booking.startTime}</p>
            
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Problem Description</h3>
            <p style={{ margin: '0.5rem 0', color: 'var(--text-light)' }}>{booking.problemDescription}</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Provider Info</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--secondary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {booking.providerId?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{booking.providerId?.name}</p>
                <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>{booking.providerId?.phone}</p>
              </div>
            </div>
            
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Payment Info</h3>
            <p style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>
              <strong>Amount:</strong> <span style={{ color: 'var(--primary-color)' }}>₹{booking.finalPrice || booking.estimatedPrice}</span>
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Payment Status:</strong> 
              <span style={{ 
                marginLeft: '0.5rem',
                padding: '0.2rem 0.6rem', 
                borderRadius: '4px', 
                backgroundColor: booking.paymentStatus === 'SUCCESS' ? '#dcfce7' : '#fef9c3', 
                color: booking.paymentStatus === 'SUCCESS' ? '#166534' : '#854d0e',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {booking.paymentStatus}
              </span>
            </p>
            
            {booking.paymentStatus === 'PENDING' && (
              <Link to={`/payment/${booking._id}`} style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', padding: '0.8rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                Pay Now
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingDetailsPage;
