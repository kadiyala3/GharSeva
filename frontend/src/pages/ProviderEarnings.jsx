import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProviderSidebar from '../components/ProviderSidebar';
import styles from './Dashboard.module.css';

const ProviderEarnings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data } = await api.get('/bookings/provider');
        // Filter only completed bookings
        setBookings(data.data.filter(b => b.status === 'COMPLETED'));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) return <div className={styles.loading}>Loading earnings...</div>;

  const totalEarnings = bookings.reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);
  
  // Calculate this month's earnings
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyEarnings = bookings
    .filter(b => {
      const d = new Date(b.bookingDate);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <ProviderSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>My Earnings</h1>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard} style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <h3 style={{ color: '#166534' }}>Total Earnings</h3>
            <p className={styles.statValue} style={{ color: '#15803d' }}>₹{totalEarnings}</p>
          </div>
          <div className={styles.statCard} style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <h3 style={{ color: '#1e40af' }}>This Month</h3>
            <p className={styles.statValue} style={{ color: '#1d4ed8' }}>₹{monthlyEarnings}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Completed Jobs</h3>
            <p className={styles.statValue}>{bookings.length}</p>
          </div>
        </div>

        <section className={styles.recentBookings}>
          <h2>Payment History</h2>
          {bookings.length === 0 ? (
            <p>No earnings history yet.</p>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.bookingNumber}</td>
                      <td>{new Date(booking.updatedAt).toLocaleDateString()}</td>
                      <td>{booking.customerId?.name}</td>
                      <td>{booking.serviceId?.name}</td>
                      <td style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>
                        ₹{booking.finalPrice || booking.estimatedPrice}
                      </td>
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

export default ProviderEarnings;
