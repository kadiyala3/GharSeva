import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProviderSidebar from '../components/ProviderSidebar';
import styles from './Dashboard.module.css';

const ProviderBookings = () => {
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

  if (loading) return <div className={styles.loading}>Loading bookings...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <ProviderSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>All Bookings</h1>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.bookingNumber}</td>
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
                      <button onClick={() => handleUpdateStatus(booking._id, 'ON_THE_WAY')} className="btn btn-primary" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem'}}>Mark On The Way</button>
                    )}
                    {booking.status === 'ON_THE_WAY' && (
                      <button onClick={() => handleUpdateStatus(booking._id, 'ARRIVED')} className="btn btn-primary" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem'}}>Mark Arrived</button>
                    )}
                    {booking.status === 'ARRIVED' && (
                      <button onClick={() => handleUpdateStatus(booking._id, 'IN_PROGRESS')} className="btn btn-primary" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem'}}>Start Service</button>
                    )}
                    {booking.status === 'IN_PROGRESS' && (
                      <button onClick={() => handleUpdateStatus(booking._id, 'COMPLETED')} className="btn btn-primary" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem'}}>Mark Completed</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ProviderBookings;
