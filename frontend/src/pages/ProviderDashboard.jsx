import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ProviderSidebar from '../components/ProviderSidebar';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import styles from './Dashboard.module.css';

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/provider');
        setBookings(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <ProviderSidebar />
      
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle} style={{ margin: 0 }}>Provider Dashboard</h1>
          <ProfilePictureUpload />
        </div>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Jobs</h3>
            <p className={styles.statValue}>{bookings.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Pending Requests</h3>
            <p className={styles.statValue}>{bookings.filter(b => b.status === 'PENDING').length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Completed</h3>
            <p className={styles.statValue}>{bookings.filter(b => b.status === 'COMPLETED').length}</p>
          </div>
        </div>

        <section className={styles.recentBookings}>
          <h2>Job Requests & Active Jobs</h2>
          {bookings.length === 0 ? (
            <p>You have no jobs right now.</p>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.customerId?.name || 'Unknown'}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()} {booking.startTime}</td>
                      <td><span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>{booking.status}</span></td>
                      <td>
                        {booking.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleUpdateStatus(booking._id, 'ACCEPTED')} className="btn btn-primary" style={{marginRight: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.875rem'}}>Accept</button>
                            <button onClick={() => handleUpdateStatus(booking._id, 'REJECTED')} className="btn btn-secondary" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem'}}>Reject</button>
                          </>
                        )}
                        {booking.status === 'ACCEPTED' && (
                          <button onClick={() => handleUpdateStatus(booking._id, 'COMPLETED')} className="btn btn-primary" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem'}}>Mark Completed</button>
                        )}
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

export default ProviderDashboard;
