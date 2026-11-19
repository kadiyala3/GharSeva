import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import ProviderSidebar from '../components/ProviderSidebar';
import styles from './Dashboard.module.css';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const ProviderVerification = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/providers/${user?._id}`);
        setProfile(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  const status = profile?.verificationStatus || 'PENDING';

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <ProviderSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Verification Status</h1>
        
        <div style={{ backgroundColor: 'white', padding: '3rem 2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          
          {status === 'VERIFIED' && (
            <>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1.5rem auto' }}>✓</div>
              <h2 style={{ color: '#166534', marginBottom: '1rem' }}>Account Verified</h2>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                Congratulations! Your account has been verified by our admin team. You can now receive booking requests from customers and start earning.
              </p>
            </>
          )}

          {status === 'PENDING' && (
            <>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fef9c3', color: '#854d0e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1.5rem auto' }}>⌛</div>
              <h2 style={{ color: '#854d0e', marginBottom: '1rem' }}>Verification Pending</h2>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                Your account is currently under review by our team. This usually takes 24-48 hours. 
                Please ensure you have completed your profile and added your services. You cannot receive bookings until verified.
              </p>
            </>
          )}

          {status === 'REJECTED' && (
            <>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1.5rem auto' }}>✕</div>
              <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Verification Rejected</h2>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>
                Unfortunately, your verification was rejected. Please contact support@gharseva.com to resolve any issues with your application.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderVerification;
