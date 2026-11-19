import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import CustomerSidebar from '../components/CustomerSidebar';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import styles from './Dashboard.module.css';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        setBookings(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <CustomerSidebar />
      
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle} style={{ margin: 0 }}>Dashboard</h1>
          <ProfilePictureUpload />
        </div>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Bookings</h3>
            <p className={styles.statValue}>{bookings.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Active Bookings</h3>
            <p className={styles.statValue}>{bookings.filter(b => ['PENDING', 'ACCEPTED', 'CONFIRMED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status)).length}</p>
          </div>
        </div>

        <section className={styles.recentBookings}>
          <h2>Recent Bookings</h2>
          {bookings.length === 0 ? (
            <p>You have no recent bookings.</p>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.bookingNumber}</td>
                      <td>{booking.serviceId?.name || 'Unknown'}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td><span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>{booking.status}</span></td>
                      <td>₹{booking.estimatedPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CustomerDashboard;
