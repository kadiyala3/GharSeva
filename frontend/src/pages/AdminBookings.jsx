import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import styles from './Dashboard.module.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // We'll use the generic bookings endpoint if available for admins, or mock it.
        const { data } = await api.get('/bookings');
        setBookings(data.data);
      } catch (error) {
        console.error(error);
        // Fallback to customer/provider endpoint if generic admin one is missing
        const { data } = await api.get('/bookings/my');
        setBookings(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className={styles.loading}>Loading bookings...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>All Bookings</h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.bookingNumber}</td>
                    <td>{booking.customerId?.name || 'Unknown'}</td>
                    <td>{booking.providerId?.name || 'Unassigned'}</td>
                    <td>{booking.serviceId?.name || 'Service'}</td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString()} {booking.startTime}</td>
                    <td>
                      <span className={`${styles.status} ${styles[booking.status?.toLowerCase()]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>₹{booking.finalPrice || booking.estimatedPrice}</td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminBookings;
