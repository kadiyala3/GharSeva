import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CustomerSidebar from '../components/CustomerSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';

const CustomerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  if (loading) return <div className={styles.loading}>Loading notifications...</div>;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <CustomerSidebar />
      <main className={styles.mainContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className={styles.pageTitle}>Notifications</h1>
          {notifications.some(n => !n.isRead) && (
            <button 
              onClick={handleMarkAllAsRead} 
              style={{ padding: '0.6rem 1.2rem', backgroundColor: '#eef2ff', color: 'var(--primary-color)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              Mark all as read
            </button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <p style={{ color: 'var(--text-light)' }}>You have no notifications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map(notification => (
              <div 
                key={notification._id} 
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                style={{ 
                  backgroundColor: notification.isRead ? 'white' : '#f8faff', 
                  padding: '1.5rem', 
                  borderRadius: '12px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  borderLeft: notification.isRead ? '4px solid transparent' : '4px solid var(--primary-color)',
                  cursor: notification.isRead ? 'default' : 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>{notification.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.95rem' }}>
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerNotifications;
